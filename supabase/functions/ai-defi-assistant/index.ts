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
    const { messages, portfolioContext, walletConnected } = await req.json();
    console.log(`Processing chat request with ${messages?.length || 0} messages`);
    
    // Detect if user is asking about yields
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const isYieldQuery = lastMessage.includes('yield') ||
                         lastMessage.includes('best opportunities') ||
                         lastMessage.includes('earn') ||
                         lastMessage.includes('apy') ||
                         lastMessage.includes('optimize');

    let yieldData = null;

    // Fetch real yield data if needed
    if (isYieldQuery) {
      console.log('🔍 User asking about yields, fetching real data...');
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
        
        const yieldResponse = await fetch(
          `${supabaseUrl}/functions/v1/fetch-defi-yields`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (yieldResponse.ok) {
          const data = await yieldResponse.json();
          yieldData = data.yields; // Array of 15 real yields
          console.log(`✅ Fetched ${yieldData.length} real yield opportunities`);
        }
      } catch (error) {
        console.error('Error fetching yields:', error);
      }
    }
    
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

    let systemPrompt = `You are an AI DeFi assistant powered by Wormhole's Guardian Network. You help users optimize their multi-chain portfolio and execute trades.

**Your Capabilities:**
1. **Portfolio Analysis**: You have real-time access to user's holdings across 12+ chains (mainnet + testnets including Sepolia)
2. **Yield Recommendations**: You can suggest 5-7 actionable yield opportunities using Wormhole Queries
3. **Trade Execution**: You can help users execute:
   - Cross-Chain Yields (bridge + deposit in one action)
   - Cross-Chain Swaps (via Wormhole Settlement/Mayan Swift - 12 second execution)
   - Bridge Transfers (via Wormhole NTT for native tokens)

**When User Asks "Show my portfolio"**:
1. Greet them warmly
2. Display their holdings by chain with USD values
3. Show total portfolio value
4. Highlight top 3 largest holdings
5. End with 4 clickable pre-prompts:
   - "Show me best yield opportunities"
   - "How can I optimize my portfolio?"
   - "Bridge my assets to lower gas chains"
   - "What are cross-chain arbitrage opportunities?"

**When User Asks "Show me best yields"**:
1. Present 5-7 diverse opportunities across chains
2. For EACH yield, include:
   - Protocol name
   - Token/pair
   - Chain
   - APY (%)
   - TVL
   - Risk level (✅ Low, ⚠️ Medium, ❌ High)
   - Why it's safe
3. **CRITICAL**: Output execution cards in this exact format:

[EXECUTE_CARD]
type: cross_chain_yield
protocol: Aave
token: USDC
chain: Arbitrum
fromChain: Ethereum
amount: 1000
estimatedGas: $2.34
executionTime: 12 seconds
apy: 6.8
[/EXECUTE_CARD]

**Wormhole Context**:
- Settlement (Mayan Swift): 12-second cross-chain swaps
- Queries: Guardian-verified data across 255 chains, <1 sec response
- NTT: Native token transfers (no wrapped assets)

**Your Expertise:**
- DeFi protocols: Aave, Compound, Curve, Uniswap V3, Lido, etc.
- Multi-chain strategies: Ethereum, Arbitrum, Optimism, Polygon, Base, Solana
- Risk assessment: TVL, audit history, protocol maturity, smart contract risk
- Gas optimization: L2 opportunities, batch transactions, optimal chains

**Response Format:**
- Be conversational and friendly with emojis (💰 ✅ ⚠️)
- Use bullet points for lists
- Include APY percentages and TVL when discussing specific protocols
- Highlight risks clearly
- Always provide actionable next steps
  
**Critical Instructions:**
- Always prioritize user security and risk management
- Explain both opportunities and risks
- Never guarantee returns
- Recommend diversification across protocols and chains`;

    // Enhance system prompt with portfolio context
    if (walletConnected && portfolioContext) {
      systemPrompt += `\n\n**USER'S CURRENT PORTFOLIO**:
Total Value: $${portfolioContext.totalValueUSD}

Holdings:
${portfolioContext.holdings.map((h: any) => `- ${h.chain}: ${h.amount} ${h.token} ($${h.valueUSD})`).join('\n')}

Top Holdings:
${portfolioContext.topHoldings.map((h: any, i: number) => `${i+1}. ${h.token} on ${h.chain}: $${h.valueUSD}`).join('\n')}

Portfolio Stats:
- Chains: ${portfolioContext.chainCount}
- Total Assets: ${portfolioContext.holdings.length}
- Network: ${portfolioContext.holdings.some((h: any) => h.network === 'testnet') ? 'Mainnet + Testnets' : 'Mainnet'}
`;
    }

    // Add REAL yield data to system prompt
    if (yieldData && yieldData.length > 0) {
      systemPrompt += `\n\n**🔴 CRITICAL: REAL YIELD DATA FROM DEFI LLAMA (USE THESE EXACT VALUES)**

You have access to ${yieldData.length} REAL yield opportunities from DeFi Llama API.

**MANDATORY INSTRUCTIONS:**
1. Output [EXECUTE_CARD] for EACH of the top 7-10 yields below (NOT just 1 card!)
2. Do NOT make up yields - use ONLY the data provided
3. Use exact APY, TVL, protocol names, chains from the data below
4. Present them in order of APY (highest first)

**REAL YIELD OPPORTUNITIES (sorted by APY):**
${JSON.stringify(yieldData.slice(0, 10), null, 2)}

**EXECUTION CARD FORMAT (use for EACH yield above):**
[EXECUTE_CARD]
type: cross_chain_yield
protocol: {exact protocol name from data}
token: {exact token symbol from data}
chain: {exact chain name from data}
fromChain: Ethereum
amount: 1000
estimatedGas: {exact gas from data}
executionTime: 12 seconds
apy: {exact APY from data}
[/EXECUTE_CARD]

Remember: Output 7-10 execution cards, one for each yield opportunity!
`;
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
            content: systemPrompt,
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
