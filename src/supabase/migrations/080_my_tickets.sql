-- 080_my_tickets.sql
-- My Tickets: Seller dashboard RPCs

--------------------------------------------------------------------------------
-- RPC: List my ticket threads (seller inbox)
--------------------------------------------------------------------------------

create or replace function public.ticket_list_my_threads(
  p_limit int default 50
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_user uuid;
  v_items jsonb;
begin
  v_user := public.require_authed();

  -- Get threads where user is a member, with last message preview
  select coalesce(
    jsonb_agg(
      to_jsonb(t) 
      order by t.last_message_at desc nulls last
    ), 
    '[]'::jsonb
  )
  into v_items
  from (
    select
      th.id as "threadId",
      th.status as status,
      th.created_at as "createdAt",
      th.closed_at as "closedAt",
      l.id as "listingId",
      l.event_name as "eventName",
      l.city as city,
      l.price_cents as "priceCents",
      l.currency as currency,
      lm.body as "lastMessage",
      lm.created_at as "lastMessageAt"
    from public.ticket_thread_members tm
    join public.ticket_threads th on th.id = tm.thread_id
    left join public.ticket_listings l on l.id = th.listing_id
    left join lateral (
      select m.body, m.created_at
      from public.ticket_messages m
      where m.thread_id = th.id
        and not m.is_removed -- Exclude removed messages from preview
      order by m.created_at desc
      limit 1
    ) lm on true
    where tm.user_id = v_user
    order by lm.created_at desc nulls last
    limit p_limit
  ) t;

  return jsonb_build_object('items', v_items);
end;
$$;

comment on function public.ticket_list_my_threads(int) is 
  'Returns ticket threads for current user with last message preview. Used for seller inbox.';

--------------------------------------------------------------------------------
-- Ensure ticket_list_my_listings exists
-- (User mentioned they manually created this, but let's have a reference)
--------------------------------------------------------------------------------

create or replace function public.ticket_list_my_listings(
  p_limit int default 50
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_user uuid;
  v_items jsonb;
begin
  v_user := public.require_authed();

  -- Get all listings created by current user (including removed)
  select coalesce(
    jsonb_agg(
      to_jsonb(t) 
      order by t.created_at desc
    ), 
    '[]'::jsonb
  )
  into v_items
  from (
    select
      l.id as "listingId",
      l.beacon_id as "beaconId",
      case 
        when l.is_removed then 'removed'::text
        else l.status 
      end as status,
      l.event_name as "eventName",
      l.event_starts_at as "eventStartsAt",
      l.venue as venue,
      l.city as city,
      l.quantity as quantity,
      l.price_cents as "priceCents",
      l.currency as currency,
      l.transfer_method as "transferMethod",
      l.notes as notes,
      l.created_at as "createdAt",
      l.is_removed as "isRemoved",
      l.removed_reason as "removedReason",
      l.removed_at as "removedAt"
    from public.ticket_listings l
    where l.seller_user_id = v_user
    order by l.created_at desc
    limit p_limit
  ) t;

  return jsonb_build_object('items', v_items);
end;
$$;

comment on function public.ticket_list_my_listings(int) is 
  'Returns all ticket listings created by current user, including removed ones. Seller-only view.';

--------------------------------------------------------------------------------
-- Index optimizations for My Tickets queries
--------------------------------------------------------------------------------

-- My listings query
create index if not exists ticket_listings_seller_created_idx 
  on public.ticket_listings(seller_user_id, created_at desc);

-- My threads query
create index if not exists ticket_thread_members_user_idx 
  on public.ticket_thread_members(user_id);

-- Last message lookup
create index if not exists ticket_messages_thread_created_idx 
  on public.ticket_messages(thread_id, created_at desc)
  where not is_removed;
