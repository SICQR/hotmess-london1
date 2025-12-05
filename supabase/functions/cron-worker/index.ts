// cron-worker/index.ts
// Automated maintenance tasks for HOTMESS beacon system
// Run via Supabase Cron: */5 * * * * (every 5 minutes)

import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (_req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const results = {
    timestamp: new Date().toISOString(),
    tasks: [] as any[],
  };

  try {
    // Task 1: Expire beacons
    console.log("Running: expire_beacons");
    const { error: expireError } = await supabase.rpc("expire_beacons");
    results.tasks.push({
      name: "expire_beacons",
      status: expireError ? "error" : "success",
      error: expireError?.message || null,
    });

    // Task 2: Cleanup scan sessions
    console.log("Running: cleanup_scan_sessions");
    const { error: cleanupSessionsError } = await supabase.rpc("cleanup_scan_sessions");
    results.tasks.push({
      name: "cleanup_scan_sessions",
      status: cleanupSessionsError ? "error" : "success",
      error: cleanupSessionsError?.message || null,
    });

    // Task 3: Cleanup rate limits
    console.log("Running: cleanup_rate_limits");
    const { error: cleanupRateLimitsError } = await supabase.rpc("cleanup_rate_limits");
    results.tasks.push({
      name: "cleanup_rate_limits",
      status: cleanupRateLimitsError ? "error" : "success",
      error: cleanupRateLimitsError?.message || null,
    });

    console.log("✅ Cron tasks completed:", results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("❌ Cron worker error:", error);
    
    return new Response(
      JSON.stringify({
        error: "cron_failed",
        message: error.message,
        results,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
