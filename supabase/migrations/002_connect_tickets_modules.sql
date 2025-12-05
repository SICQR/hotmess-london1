-- ============================================================================
-- HOTMESS CONNECT + TICKETS MODULES - Production Schema
-- ============================================================================
-- Complete implementation for Connect (mutual opt-in) and Tickets (P2P marketplace)
-- with membership-locked messaging, moderation hooks, and notification integration.
-- ============================================================================

-- Premium flag + helper functions
-- ============================================================================
alter table public.profiles
add column if not exists is_premium boolean not null default false;

create or replace function public.require_authed() returns uuid
language plpgsql stable as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  return auth.uid();
end;
$$;

create or replace function public.require_age18(p_user uuid) returns void
language plpgsql stable as $$
begin
  if not exists(select 1 from public.profiles where user_id=p_user and age18_confirmed=true) then
    raise exception 'age18_required';
  end if;
end;
$$;

create or replace function public.require_consent(p_user uuid) returns void
language plpgsql stable as $$
begin
  if not exists(select 1 from public.profiles where user_id=p_user and consent_confirmed=true) then
    raise exception 'consent_required';
  end if;
end;
$$;

create or replace function public.require_premium(p_user uuid) returns void
language plpgsql stable as $$
begin
  if not exists(select 1 from public.profiles where user_id=p_user and is_premium=true) then
    raise exception 'premium_required';
  end if;
end;
$$;

-- Helper: check beacon is live + correct type
create or replace function public.require_live_beacon(p_beacon_id uuid, p_type beacon_type) returns public.beacons
language plpgsql stable as $$
declare v public.beacons;
begin
  select * into v from public.beacons where id=p_beacon_id limit 1;
  if not found then raise exception 'beacon_not_found'; end if;
  if v.type <> p_type then raise exception 'beacon_type_mismatch'; end if;

  if v.status = 'live' and v.expires_at <= now() then
    update public.beacons set status='expired', updated_at=now() where id=v.id;
    v.status := 'expired';
  end if;

  if v.status <> 'live' then raise exception 'beacon_not_live'; end if;
  if v.starts_at > now() then raise exception 'beacon_not_started'; end if;
  if v.expires_at <= now() then raise exception 'beacon_expired'; end if;

  return v;
end;
$$;

-- Pref check + outbox enqueue (channel respects prefs; in_app default true)
create or replace function public.pref_enabled(p_user uuid, p_category notif_category, p_channel notif_channel)
returns boolean
language sql stable as $$
  select
    case p_channel
      when 'in_app' then coalesce((select in_app from public.notification_prefs where user_id=p_user and category=p_category), true)
      when 'push'   then coalesce((select push   from public.notification_prefs where user_id=p_user and category=p_category), false)
      when 'email'  then coalesce((select email  from public.notification_prefs where user_id=p_user and category=p_category), false)
    end;
$$;

create or replace function public.maybe_enqueue(
  p_user uuid,
  p_category notif_category,
  p_channel notif_channel,
  p_template_key text,
  p_payload jsonb,
  p_dedupe_key text,
  p_not_before timestamptz default now()
) returns void
language plpgsql security definer as $$
begin
  if public.pref_enabled(p_user, p_category, p_channel) then
    perform public.enqueue_notification(p_user, p_channel, p_template_key, p_payload, p_dedupe_key, p_not_before);
  end if;
end;
$$;

-- =========================================
-- CONNECT MODULE
-- =========================================
do $$ begin
  create type connect_intent_status as enum ('live','expired','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type connect_optin_status as enum ('pending','matched','withdrawn','declined');
exception when duplicate_object then null; end $$;

do $$ begin
  create type connect_thread_status as enum ('open','closed');
exception when duplicate_object then null; end $$;

create table if not exists public.connect_intents (
  id uuid primary key default gen_random_uuid(),
  public_id uuid not null default gen_random_uuid(), -- safe handle for sharing/lookup
  beacon_id uuid not null references public.beacons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status connect_intent_status not null default 'live',
  tags jsonb not null default '[]'::jsonb, -- max 3 enforced in rpc
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create unique index if not exists connect_intents_public_id_uq on public.connect_intents(public_id);
create index if not exists connect_intents_beacon_idx on public.connect_intents(beacon_id, status, expires_at desc);
create unique index if not exists connect_intent_one_active_per_user
  on public.connect_intents(user_id)
  where status='live';

create table if not exists public.connect_optins (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references auth.users(id) on delete cascade,
  to_intent_id uuid not null references public.connect_intents(id) on delete cascade,
  status connect_optin_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists connect_optins_unique
  on public.connect_optins(from_user_id, to_intent_id);

create index if not exists connect_optins_to_intent_idx on public.connect_optins(to_intent_id, status);

create table if not exists public.connect_threads (
  id uuid primary key default gen_random_uuid(),
  beacon_id uuid not null references public.beacons(id) on delete cascade,
  status connect_thread_status not null default 'open',
  created_at timestamptz not null default now(),
  closed_at timestamptz null,
  close_reason text null
);

create table if not exists public.connect_thread_members (
  thread_id uuid not null references public.connect_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  primary key (thread_id, user_id)
);

create table if not exists public.connect_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.connect_threads(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists connect_messages_thread_idx on public.connect_messages(thread_id, created_at);

-- RLS
alter table public.connect_intents enable row level security;
alter table public.connect_optins enable row level security;
alter table public.connect_threads enable row level security;
alter table public.connect_thread_members enable row level security;
alter table public.connect_messages enable row level security;

-- No direct access for intents/optins to public; use RPC. Users can see their own record.
drop policy if exists "connect_intents_select_own" on public.connect_intents;
create policy "connect_intents_select_own" on public.connect_intents
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "connect_optins_select_own" on public.connect_optins;
create policy "connect_optins_select_own" on public.connect_optins
for select to authenticated
using (from_user_id = auth.uid());

-- Threads/members/messages: members only
drop policy if exists "connect_threads_select_member" on public.connect_threads;
create policy "connect_threads_select_member" on public.connect_threads
for select to authenticated
using (
  exists(select 1 from public.connect_thread_members m where m.thread_id=id and m.user_id=auth.uid())
);

drop policy if exists "connect_members_select_member" on public.connect_thread_members;
create policy "connect_members_select_member" on public.connect_thread_members
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "connect_messages_select_member" on public.connect_messages;
create policy "connect_messages_select_member" on public.connect_messages
for select to authenticated
using (
  exists(select 1 from public.connect_thread_members m where m.thread_id=thread_id and m.user_id=auth.uid())
);

-- RPC: create intent (Premium + 18+ + consent; beacon must be live connect)
create or replace function public.connect_create_intent(
  p_beacon_id uuid,
  p_tags jsonb default '[]'::jsonb
) returns jsonb
language plpgsql security definer as $$
declare
  v_user uuid;
  v_beacon public.beacons;
  v_intent_id uuid;
  v_public_id uuid;
  v_tag_count int;
begin
  v_user := public.require_authed();
  perform public.require_age18(v_user);
  perform public.require_consent(v_user);
  perform public.require_premium(v_user);

  v_beacon := public.require_live_beacon(p_beacon_id, 'connect');

  -- enforce max 3 tags
  select coalesce(jsonb_array_length(p_tags),0) into v_tag_count;
  if v_tag_count > 3 then raise exception 'too_many_tags'; end if;

  -- create intent with same expiry as beacon
  insert into public.connect_intents(beacon_id, user_id, tags, expires_at)
  values (v_beacon.id, v_user, coalesce(p_tags,'[]'::jsonb), v_beacon.expires_at)
  returning id, public_id into v_intent_id, v_public_id;

  return jsonb_build_object(
    'intentId', v_intent_id,
    'publicId', v_public_id,
    'expiresAt', v_beacon.expires_at
  );
end;
$$;

-- RPC: list intent cards for this beacon (returns SAFE fields; no user_id)
create or replace function public.connect_list_intents(
  p_beacon_id uuid,
  p_limit int default 50
) returns jsonb
language plpgsql security definer as $$
declare
  v_user uuid;
  v_beacon public.beacons;
begin
  v_user := public.require_authed();
  perform public.require_age18(v_user);
  perform public.require_consent(v_user);
  perform public.require_premium(v_user);

  v_beacon := public.require_live_beacon(p_beacon_id, 'connect');

  return (
    select jsonb_build_object(
      'items',
      coalesce(jsonb_agg(jsonb_build_object(
        'publicId', i.public_id,
        'tags', i.tags,
        'expiresAt', i.expires_at,
        'createdAt', i.created_at
      ) order by i.created_at desc), '[]'::jsonb)
    )
    from public.connect_intents i
    where i.beacon_id = v_beacon.id
      and i.status='live'
      and i.expires_at > now()
      and i.user_id <> v_user
    limit 1
  );
end;
$$;

-- RPC: opt-in to an intent by publicId
-- If mutual opt-in exists -> create thread + mark matched.
create or replace function public.connect_opt_in(
  p_intent_public_id uuid
) returns jsonb
language plpgsql security definer as $$
declare
  v_user uuid;
  v_intent public.connect_intents;
  v_target_user uuid;
  v_existing uuid;
  v_reverse_exists boolean;
  v_thread_id uuid;
  v_beacon_id uuid;
begin
  v_user := public.require_authed();
  perform public.require_age18(v_user);
  perform public.require_consent(v_user);
  perform public.require_premium(v_user);

  select * into v_intent from public.connect_intents
  where public_id = p_intent_public_id
  limit 1;

  if not found then raise exception 'intent_not_found'; end if;
  if v_intent.status <> 'live' or v_intent.expires_at <= now() then raise exception 'intent_expired'; end if;
  if v_intent.user_id = v_user then raise exception 'cannot_opt_in_to_self'; end if;

  v_target_user := v_intent.user_id;
  v_beacon_id := v_intent.beacon_id;

  -- insert opt-in (idempotent)
  insert into public.connect_optins(from_user_id, to_intent_id)
  values (v_user, v_intent.id)
  on conflict (from_user_id, to_intent_id) do update set updated_at=now()
  returning id into v_existing;

  -- check reverse: did target user opt-in to any live intent of v_user for same beacon?
  select exists(
    select 1
    from public.connect_optins o
    join public.connect_intents myi on myi.id = o.to_intent_id
    where o.from_user_id = v_target_user
      and myi.user_id = v_user
      and myi.beacon_id = v_beacon_id
      and myi.status='live'
      and myi.expires_at > now()
      and o.status in ('pending','matched')
  ) into v_reverse_exists;

  if v_reverse_exists then
    insert into public.connect_threads(beacon_id) values (v_beacon_id) returning id into v_thread_id;
    insert into public.connect_thread_members(thread_id, user_id) values (v_thread_id, v_user), (v_thread_id, v_target_user);

    update public.connect_optins set status='matched', updated_at=now()
    where (from_user_id=v_user and to_intent_id=v_intent.id)
       or (from_user_id=v_target_user and to_intent_id in (
            select id from public.connect_intents where user_id=v_user and beacon_id=v_beacon_id and status='live'
          ));

    -- notify both sides: match (in-app default on)
    perform public.maybe_enqueue(
      v_target_user, 'connect', 'in_app',
      'connect.match',
      jsonb_build_object('threadId', v_thread_id),
      'connect:match:'||v_thread_id::text||':'||v_target_user::text
    );

    perform public.maybe_enqueue(
      v_user, 'connect', 'in_app',
      'connect.match',
      jsonb_build_object('threadId', v_thread_id),
      'connect:match:'||v_thread_id::text||':'||v_user::text
    );

    return jsonb_build_object('status','matched','threadId',v_thread_id);
  else
    -- notify target: request received
    perform public.maybe_enqueue(
      v_target_user, 'connect', 'in_app',
      'connect.request',
      jsonb_build_object('intentPublicId', v_intent.public_id),
      'connect:req:'||v_intent.public_id::text||':'||v_user::text
    );

    return jsonb_build_object('status','pending');
  end if;
end;
$$;

-- RPC: send message (members only)
create or replace function public.connect_send_message(
  p_thread_id uuid,
  p_body text
) returns jsonb
language plpgsql security definer as $$
declare
  v_user uuid;
  v_other uuid;
  v_msg_id uuid;
begin
  v_user := public.require_authed();
  perform public.require_age18(v_user);
  perform public.require_consent(v_user);

  if not exists(select 1 from public.connect_thread_members where thread_id=p_thread_id and user_id=v_user) then
    raise exception 'not_thread_member';
  end if;

  insert into public.connect_messages(thread_id, sender_user_id, body)
  values (p_thread_id, v_user, p_body)
  returning id into v_msg_id;

  -- notify the other member (in-app + optional push/email via prefs worker)
  select user_id into v_other
  from public.connect_thread_members
  where thread_id=p_thread_id and user_id <> v_user
  limit 1;

  if v_other is not null then
    perform public.maybe_enqueue(
      v_other, 'connect', 'in_app',
      'connect.message',
      jsonb_build_object('threadId', p_thread_id, 'messageId', v_msg_id),
      'connect:msg:'||v_msg_id::text||':'||v_other::text
    );

    perform public.maybe_enqueue(
      v_other, 'connect', 'push',
      'connect.message',
      jsonb_build_object('threadId', p_thread_id, 'messageId', v_msg_id),
      'connect:msgpush:'||v_msg_id::text||':'||v_other::text
    );

    perform public.maybe_enqueue(
      v_other, 'connect', 'email',
      'connect.message',
      jsonb_build_object('threadId', p_thread_id, 'messageId', v_msg_id),
      'connect:msgemail:'||v_msg_id::text||':'||v_other::text
    );
  end if;

  return jsonb_build_object('messageId', v_msg_id);
end;
$$;

-- RPC: close thread (member)
create or replace function public.connect_close_thread(
  p_thread_id uuid,
  p_reason text default null
) returns void
language plpgsql security definer as $$
declare v_user uuid;
begin
  v_user := public.require_authed();
  if not exists(select 1 from public.connect_thread_members where thread_id=p_thread_id and user_id=v_user) then
    raise exception 'not_thread_member';
  end if;

  update public.connect_threads
  set status='closed', closed_at=now(), close_reason=p_reason
  where id=p_thread_id;
end;
$$;

-- =========================================
-- TICKETS MODULE
-- =========================================
do $$ begin
  create type ticket_listing_status as enum ('live','pending_review','sold','removed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ticket_transfer_method as enum ('digital_transfer','pdf','meet_in_person','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ticket_thread_status as enum ('open','closed');
exception when duplicate_object then null; end $$;

create table if not exists public.ticket_listings (
  id uuid primary key default gen_random_uuid(),
  beacon_id uuid not null references public.beacons(id) on delete cascade,
  seller_user_id uuid not null references auth.users(id) on delete cascade,

  status ticket_listing_status not null default 'pending_review',
  event_name text not null,
  event_starts_at timestamptz null,
  venue text null,
  city text null,

  quantity int not null check (quantity between 1 and 10),
  price_cents int not null check (price_cents between 0 and 5000000),
  currency text not null default 'GBP',

  transfer_method ticket_transfer_method not null default 'digital_transfer',
  notes text null,

  proof_url text null,            -- store a signed URL or storage path
  proof_required boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ticket_listings_beacon_idx on public.ticket_listings(beacon_id, status, created_at desc);
create index if not exists ticket_listings_seller_idx on public.ticket_listings(seller_user_id, status);

-- One buyer thread per listing (keeps it clean; buyer/seller can message)
create table if not exists public.ticket_threads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.ticket_listings(id) on delete cascade,
  status ticket_thread_status not null default 'open',
  created_at timestamptz not null default now(),
  closed_at timestamptz null
);

create table if not exists public.ticket_thread_members (
  thread_id uuid not null references public.ticket_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null, -- 'buyer'|'seller'
  primary key (thread_id, user_id)
);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.ticket_threads(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists ticket_messages_thread_idx on public.ticket_messages(thread_id, created_at);

-- Moderation/audit
create table if not exists public.ticket_moderation_events (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.ticket_listings(id) on delete cascade,
  actor_user_id uuid null references auth.users(id) on delete set null,
  action text not null, -- 'approve'|'reject'|'remove'|'mark_sold'
  reason text null,
  created_at timestamptz not null default now()
);

alter table public.ticket_listings enable row level security;
alter table public.ticket_threads enable row level security;
alter table public.ticket_thread_members enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.ticket_moderation_events enable row level security;

-- Sellers can select their own listings
drop policy if exists "ticket_listings_select_own" on public.ticket_listings;
create policy "ticket_listings_select_own" on public.ticket_listings
for select to authenticated
using (seller_user_id = auth.uid());

-- Threads/messages: members only
drop policy if exists "ticket_threads_select_member" on public.ticket_threads;
create policy "ticket_threads_select_member" on public.ticket_threads
for select to authenticated
using (exists(select 1 from public.ticket_thread_members m where m.thread_id=id and m.user_id=auth.uid()));

drop policy if exists "ticket_members_select_member" on public.ticket_thread_members;
create policy "ticket_members_select_member" on public.ticket_thread_members
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "ticket_messages_select_member" on public.ticket_messages;
create policy "ticket_messages_select_member" on public.ticket_messages
for select to authenticated
using (exists(select 1 from public.ticket_thread_members m where m.thread_id=thread_id and m.user_id=auth.uid()));

-- admin-only moderation table select (optional)
drop policy if exists "ticket_mod_admin" on public.ticket_moderation_events;
create policy "ticket_mod_admin" on public.ticket_moderation_events
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Seller trust heuristic: pending_review if first listing OR no proof and beacon requires
create or replace function public.ticket_should_review(p_seller uuid, p_proof_url text, p_proof_required boolean)
returns boolean
language sql stable as $$
  select
    (select count(*) from public.ticket_listings where seller_user_id=p_seller) < 2
    or (p_proof_required and p_proof_url is null);
$$;

-- RPC: create listing (beacon must be live ticket; 18+; consent recommended)
create or replace function public.ticket_create_listing(
  p_beacon_id uuid,
  p_event_name text,
  p_event_starts_at timestamptz,
  p_venue text,
  p_city text,
  p_quantity int,
  p_price_cents int,
  p_currency text,
  p_transfer_method ticket_transfer_method,
  p_notes text,
  p_proof_url text
) returns jsonb
language plpgsql security definer as $$
declare
  v_user uuid;
  v_beacon public.beacons;
  v_listing_id uuid;
  v_status ticket_listing_status;
  v_proof_required boolean := false;
  v_review boolean;
begin
  v_user := public.require_authed();
  perform public.require_age18(v_user);
  -- If you want tickets to require consent-confirmed, enforce:
  perform public.require_consent(v_user);

  v_beacon := public.require_live_beacon(p_beacon_id, 'ticket');

  -- Allow beacon to dictate proof rules via action_config.proof_required
  v_proof_required := coalesce((v_beacon.action_config->>'proofRequired')::boolean, false);

  v_review := public.ticket_should_review(v_user, p_proof_url, v_proof_required);
  v_status := case when v_review then 'pending_review' else 'live' end;

  insert into public.ticket_listings(
    beacon_id, seller_user_id, status,
    event_name, event_starts_at, venue, city,
    quantity, price_cents, currency,
    transfer_method, notes,
    proof_url, proof_required
  ) values (
    v_beacon.id, v_user, v_status,
    p_event_name, p_event_starts_at, p_venue, p_city,
    p_quantity, p_price_cents, coalesce(p_currency,'GBP'),
    coalesce(p_transfer_method,'digital_transfer'), p_notes,
    p_proof_url, v_proof_required
  ) returning id into v_listing_id;

  insert into public.ticket_moderation_events(listing_id, actor_user_id, action, reason)
  values (v_listing_id, v_user, 'create', case when v_review then 'pending_review' else 'auto_live' end);

  return jsonb_build_object('listingId', v_listing_id, 'status', v_status);
end;
$$;

-- RPC: list listings for beacon (SAFE fields, no seller id)
create or replace function public.ticket_list_listings(
  p_beacon_id uuid,
  p_limit int default 50
) returns jsonb
language plpgsql security definer as $$
declare
  v_user uuid;
  v_beacon public.beacons;
begin
  v_user := public.require_authed();
  perform public.require_age18(v_user);
  perform public.require_consent(v_user);

  v_beacon := public.require_live_beacon(p_beacon_id, 'ticket');

  return (
    select jsonb_build_object(
      'items',
      coalesce(jsonb_agg(jsonb_build_object(
        'listingId', l.id,
        'status', l.status,
        'eventName', l.event_name,
        'eventStartsAt', l.event_starts_at,
        'venue', l.venue,
        'city', l.city,
        'quantity', l.quantity,
        'priceCents', l.price_cents,
        'currency', l.currency,
        'transferMethod', l.transfer_method,
        'notes', l.notes,
        'proofRequired', l.proof_required
      ) order by l.created_at desc), '[]'::jsonb)
    )
    from public.ticket_listings l
    where l.beacon_id = v_beacon.id
      and l.status = 'live'
    limit 1
  );
end;
$$;

-- RPC: open thread (buyer -> seller) per listing
create or replace function public.ticket_open_thread(
  p_listing_id uuid
) returns jsonb
language plpgsql security definer as $$
declare
  v_user uuid;
  v_listing public.ticket_listings;
  v_thread_id uuid;
begin
  v_user := public.require_authed();
  perform public.require_age18(v_user);
  perform public.require_consent(v_user);

  select * into v_listing from public.ticket_listings where id=p_listing_id limit 1;
  if not found then raise exception 'listing_not_found'; end if;
  if v_listing.status <> 'live' then raise exception 'listing_not_available'; end if;
  if v_listing.seller_user_id = v_user then raise exception 'cannot_message_self'; end if;

  -- create thread
  insert into public.ticket_threads(listing_id) values (v_listing.id)
  returning id into v_thread_id;

  insert into public.ticket_thread_members(thread_id, user_id, role)
  values (v_thread_id, v_user, 'buyer'),
         (v_thread_id, v_listing.seller_user_id, 'seller');

  -- notify seller (in_app + optional email/push)
  perform public.maybe_enqueue(
    v_listing.seller_user_id, 'tickets', 'in_app',
    'ticket.thread_opened',
    jsonb_build_object('threadId', v_thread_id, 'listingId', v_listing.id),
    'ticket:thread:'||v_thread_id::text||':'||v_listing.seller_user_id::text
  );

  perform public.maybe_enqueue(
    v_listing.seller_user_id, 'tickets', 'push',
    'ticket.thread_opened',
    jsonb_build_object('threadId', v_thread_id, 'listingId', v_listing.id),
    'ticket:threadpush:'||v_thread_id::text||':'||v_listing.seller_user_id::text
  );

  perform public.maybe_enqueue(
    v_listing.seller_user_id, 'tickets', 'email',
    'ticket.thread_opened',
    jsonb_build_object('threadId', v_thread_id, 'listingId', v_listing.id),
    'ticket:threademail:'||v_thread_id::text||':'||v_listing.seller_user_id::text
  );

  return jsonb_build_object('threadId', v_thread_id);
end;
$$;

-- RPC: send message (members only)
create or replace function public.ticket_send_message(
  p_thread_id uuid,
  p_body text
) returns jsonb
language plpgsql security definer as $$
declare
  v_user uuid;
  v_other uuid;
  v_msg_id uuid;
begin
  v_user := public.require_authed();
  perform public.require_age18(v_user);
  perform public.require_consent(v_user);

  if not exists(select 1 from public.ticket_thread_members where thread_id=p_thread_id and user_id=v_user) then
    raise exception 'not_thread_member';
  end if;

  insert into public.ticket_messages(thread_id, sender_user_id, body)
  values (p_thread_id, v_user, p_body)
  returning id into v_msg_id;

  select user_id into v_other
  from public.ticket_thread_members
  where thread_id=p_thread_id and user_id<>v_user
  limit 1;

  if v_other is not null then
    perform public.maybe_enqueue(
      v_other, 'tickets', 'in_app',
      'ticket.message',
      jsonb_build_object('threadId', p_thread_id, 'messageId', v_msg_id),
      'ticket:msg:'||v_msg_id::text||':'||v_other::text
    );
    perform public.maybe_enqueue(
      v_other, 'tickets', 'push',
      'ticket.message',
      jsonb_build_object('threadId', p_thread_id, 'messageId', v_msg_id),
      'ticket:msgpush:'||v_msg_id::text||':'||v_other::text
    );
    perform public.maybe_enqueue(
      v_other, 'tickets', 'email',
      'ticket.message',
      jsonb_build_object('threadId', p_thread_id, 'messageId', v_msg_id),
      'ticket:msgemail:'||v_msg_id::text||':'||v_other::text
    );
  end if;

  return jsonb_build_object('messageId', v_msg_id);
end;
$$;

-- Admin RPC: approve/reject/remove/mark sold
create or replace function public.ticket_admin_set_listing_status(
  p_listing_id uuid,
  p_status ticket_listing_status,
  p_reason text default null
) returns void
language plpgsql security definer as $$
declare
  v_listing public.ticket_listings;
begin
  if not public.is_admin() then raise exception 'not_authorized'; end if;

  select * into v_listing from public.ticket_listings where id=p_listing_id limit 1;
  if not found then raise exception 'listing_not_found'; end if;

  update public.ticket_listings
  set status=p_status, updated_at=now()
  where id=p_listing_id;

  insert into public.ticket_moderation_events(listing_id, actor_user_id, action, reason)
  values (p_listing_id, auth.uid(), p_status::text, p_reason);
end;
$$;
