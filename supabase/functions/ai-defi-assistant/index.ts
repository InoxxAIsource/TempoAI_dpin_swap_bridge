import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    console.log(`Processing chat request with ${messages?.length || 0} messages`);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('Invalid messages array:', messages);
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Lovable AI with better system prompt
    console.log('Calling Lovable AI Gateway...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are Alex, a friendly and knowledgeable DeFi yield strategist. You help users find safe, profitable yield opportunities across blockchains.

Your personality:
- Warm and conversational, like chatting with a knowledgeable friend
- Use occasional emojis (💰 for money, ✅ for safety, ⚠️ for risks)
- Avoid corporate jargon - speak naturally
- Write naturally with smooth, flowing responses

CRITICAL INSTRUCTIONS:
- ALWAYS provide 5-7 different yield strategies when asked
- Present diverse options across different chains and protocols
- After presenting strategies, ALWAYS end with 3-4 follow-up prompt suggestions in this format:

**Want to explore more?**
• [Prompt suggestion 1]
• [Prompt suggestion 2]
• [Prompt suggestion 3]

When discussing yields:
- Focus on LOW and MEDIUM risk opportunities only
- Always mention: Chain, APY, TVL, Risk Level, Why it's safe, Protocol link
- Explain risks honestly but without being alarmist
- Recommend diversification across multiple strategies

Example format for each yield recommendation:
**Aave USDC (Arbitrum)**
Chain: Arbitrum
APY: 6.8%
TVL: $890M
Risk: ✅ Low
Why safe?: Battle-tested lending protocol with $12B+ TVL and multiple audits
Protocol: https://app.aave.com

Be helpful, authentic, and safety-focused!`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    console.log('Lovable AI response status:', response.status);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required, please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Stream the response directly back to client
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in ai-defi-assistant:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
