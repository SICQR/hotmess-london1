import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.36.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const botToken = Deno.env.get("HOTMESS_BOT_TOKEN") ?? "";
if (!botToken) {
  throw new Error("Missing HOTMESS_BOT_TOKEN");
}

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const bot = new Bot(botToken);
const supabase = createClient(supabaseUrl, serviceRoleKey);

bot.command("start", async (ctx) => {
  const token = (ctx.match ?? "").trim();
  if (!token) {
    return await ctx.reply("🔥 HOTMESS OS: Generate a link in-app to connect.");
  }

  if (!ctx.from?.id) {
    return await ctx.reply("❌ Missing Telegram identity. Try again.");
  }

  const nowIso = new Date().toISOString();

  const { data: session, error } = await supabase
    .from("bot_sessions")
    .select("user_id")
    .eq("token", token)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (error || !session?.user_id) {
    return await ctx.reply("❌ Link expired. Try again from the app.");
  }

  await supabase
    .from("profiles")
    .update({
      telegram_id: String(ctx.from.id),
      is_connected: true,
    })
    .eq("id", session.user_id);

  // One-time token: clean up after linking.
  await supabase.from("bot_sessions").delete().eq("token", token);

  return await ctx.reply("✅ OS LINKED. Identity hidden. Stay sweaty.");
});

const handleUpdate = webhookCallback(bot, "std/http");
Deno.serve((req) => handleUpdate(req));
