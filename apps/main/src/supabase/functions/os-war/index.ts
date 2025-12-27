/**
 * HOTMESS OS — WAR DECLARATION EDGE FUNCTION
 * 
 * Handles:
 * - Atomic XP burn (500 XP)
 * - War record creation
 * - 2X XP multiplier activation
 * - Telegram broadcast to community
 * 
 * Deploy: supabase functions deploy os-war --no-verify-jwt
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WarRequest {
  beacon_id: string;
  challenger_id: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const telegramBotToken = Deno.env.get('HOTMESS_BOT_TOKEN');
    const communityChatId = Deno.env.get('COMMUNITY_CHAT_ID');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { beacon_id, challenger_id }: WarRequest = await req.json();

    if (!beacon_id || !challenger_id) {
      return new Response(
        JSON.stringify({ error: 'Missing beacon_id or challenger_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Execute SQL Transaction (declare war, burn XP, set multiplier)
    const { data: warData, error: warError } = await supabase.rpc('declare_beacon_war', {
      p_beacon_id: beacon_id,
      p_challenger_id: challenger_id,
    });

    if (warError) {
      console.error('[OS-WAR] Error declaring war:', warError);
      return new Response(JSON.stringify({ error: warError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Fetch Details for the Telegram Broadcast
    const { data: beaconDetails } = await supabase
      .from('beacons')
      .select('title, lat, lng')
      .eq('id', beacon_id)
      .single();

    const { data: kingProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', warData.king_id)
      .single();

    const { data: challengerProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', challenger_id)
      .single();

    // 3. BROADCAST TO TELEGRAM (if configured)
    if (telegramBotToken && communityChatId && beaconDetails && kingProfile && challengerProfile) {
      const venueName = beaconDetails.title || 'Unknown Venue';
      const kingUsername = kingProfile.username || 'Unknown King';
      const challengerUsername = challengerProfile.username || 'Unknown Challenger';

      const warMessage =
        `⚔️ **TERRITORIAL WAR DECLARED** ⚔️\n\n` +
        `🔥 **${challengerUsername}** has challenged **${kingUsername}** for the crown of **${venueName}**!\n\n` +
        `⚡️ **THE STAKES:** All scans at this venue count for **2X XP** for the next 24 hours.\n\n` +
        `📍 Head to the venue and pulse now to defend or conquer.\n` +
        `🔗 [hotmessldn.com/pulse](https://hotmessldn.com/pulse)`;

      try {
        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: communityChatId,
              text: warMessage,
              parse_mode: 'Markdown',
            }),
          }
        );

        if (!telegramResponse.ok) {
          console.error('[OS-WAR] Failed to send Telegram message:', await telegramResponse.text());
        } else {
          console.log('[OS-WAR] Telegram broadcast sent successfully');
        }
      } catch (telegramError) {
        console.error('[OS-WAR] Telegram error:', telegramError);
        // Don't fail the entire request if Telegram fails
      }
    }

    // 4. Return Success
    return new Response(
      JSON.stringify({
        success: true,
        war_id: warData.war_id,
        message: 'War declared successfully',
        venue: beaconDetails?.title,
        multiplier: '2x XP for 24 hours',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[OS-WAR] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
