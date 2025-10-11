import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation function to filter out Wormhole-incompatible yields
function isValidWormholeYield(yieldData: any): boolean {
  const chain = yieldData.chain?.toLowerCase();
  const symbol = yieldData.symbol?.toUpperCase();
  
  // Base cannot receive native ETH via Wormhole
  if (chain === 'base' && (symbol === 'ETH' || symbol === 'WETH')) {
    console.log(`⚠️ Filtered out invalid yield: ${symbol} on ${chain} (Wormhole limitation)`);
    return false;
  }
  
  // Add more validation rules if needed
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, portfolioContext, walletConnected } = await req.json();
    console.log(`Processing chat request with ${messages?.length || 0} messages`);
    
    // Validate portfolio context
    if (walletConnected && !portfolioContext) {
      console.warn('⚠️ Wallet connected but no portfolio context provided');
    }
    
    if (portfolioContext) {
      console.log('📊 Portfolio context received:', {
        totalValue: portfolioContext.totalValueUSD,
        holdings: portfolioContext.holdings?.length || 0,
        chains: portfolioContext.chainCount
      });
    }
    
    // Detect if user is asking about yields
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const isYieldQuery = lastMessage.includes('yield') ||
                         lastMessage.includes('best opportunities') ||
                         lastMessage.includes('opportunit') ||
                         lastMessage.includes('earn') ||
                         lastMessage.includes('best') ||
                         lastMessage.includes('apy') ||
                         lastMessage.includes('optimize');

    let yieldData = null;

    console.log('🔍 Query analysis:', { isYieldQuery, lastMessage: lastMessage.substring(0, 100) });

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
          const allYields = data.yields || [];
          
          // Filter out Wormhole-incompatible yields
          yieldData = allYields.filter(isValidWormholeYield);
          
          console.log(`✅ Fetched ${allYields.length} yields, filtered to ${yieldData.length} valid Wormhole-compatible yields`);
          if (yieldData.length > 0) {
            console.log(`Top APY after filtering: ${yieldData[0]?.apy}`);
          }
        } else {
          console.error('❌ Yield fetch failed:', yieldResponse.status);
        }
      } catch (error) {
        console.error('❌ Error fetching yields:', error);
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

    let systemPrompt = `You are Olivia, an expert AI DeFi assistant for Tempo, a cross-chain yield optimization platform powered by Wormhole.

**Your Capabilities:**
- Analyze user portfolios across multiple chains (Ethereum, Arbitrum, Optimism, Polygon, Base, Solana)
- Recommend personalized yield strategies based on user's holdings
- Suggest cross-chain opportunities using Wormhole's bridge infrastructure
- Explain DeFi protocols (Aave, Compound, Curve, Lido, Uniswap, etc.)
- Help users maximize returns while managing risk

**🚨 CRITICAL: WORMHOLE BRIDGE LIMITATIONS**

**Base Network Constraints (MUST FOLLOW):**
- ❌ CANNOT bridge native ETH to/from Base (no ETH Bridge support)
- ✅ CAN bridge USDC to/from Base (via Circle CCTP)
- ✅ CAN bridge wrapped tokens to/from Base (via WTT)

**Supported Wormhole Routes:**
✅ Ethereum ETH → Arbitrum ETH (Native ETH Bridge)
✅ Ethereum ETH → Optimism ETH (Native ETH Bridge)
✅ Ethereum ETH → Polygon ETH (Native ETH Bridge)
✅ Ethereum USDC → Base USDC (Circle CCTP)
✅ Arbitrum USDC → Base USDC (Circle CCTP)
❌ Ethereum ETH → Base ETH (NOT SUPPORTED)
❌ Base ETH → Any Chain (NOT SUPPORTED)

**When User Has ETH on Ethereum:**
1. Suggest same-chain Ethereum yields (Aave, Compound, Lido)
2. Suggest cross-chain yields on Arbitrum, Optimism, Polygon (ETH Bridge works)
3. If user specifically asks about Base: Explain limitation and suggest swapping ETH → USDC first
4. NEVER generate execution cards for "ETH → Base" routes

**When User Asks About Base Yields:**
1. Check if they have USDC (can bridge)
2. Check if they have ETH (cannot bridge, suggest swap to USDC first)
3. Always explain: "Note: Wormhole doesn't support native ETH bridging to Base. Consider swapping to USDC first if you want to bridge."

**Execution Card Validation:**
Before generating any [EXECUTE_CARD] with type="cross_chain_yield":
- If chain="Base" and token="ETH" → INVALID, don't generate
- If fromChain="Base" and token="ETH" → INVALID, don't generate
- Suggest alternative: swap to USDC, then bridge to Base

**🚨 CRITICAL RULE: DO NOT INVENT PORTFOLIO DATA**
- If user asks about portfolio and you don't have portfolioContext, respond: "Please connect your wallet so I can see your real holdings."
- If portfolioContext is provided, use ONLY this exact data - NEVER make up balances or assets.
- NEVER say things like "ETH: 2.5 on Ethereum" unless that EXACT data is in the portfolioContext below.

**OUTPUT FORMATTING:**
When providing yield opportunities or strategies, use execution cards:

[EXECUTE_CARD]
type: cross_chain_yield | cross_chain_swap | bridge
protocol: Protocol Name
token: Token Symbol
chain: Target Chain
fromChain: Source Chain (if different)
amount: Suggested Amount
estimatedGas: Gas estimate
executionTime: Time estimate
apy: APY percentage (if yield)
[/EXECUTE_CARD]

**EXECUTION CARD INSTRUCTIONS:**

When outputting [EXECUTE_CARD] blocks:

1. **Same-chain yields** (fromChain === chain):
   - User clicks button → Opens protocol app in new tab
   - Example: User has USDC on Arbitrum, wants Aave on Arbitrum
   - Set fromChain: Arbitrum, chain: Arbitrum
   
2. **Cross-chain yields** (fromChain !== chain):
   - User clicks button → Routes to /bridge
   - After bridge completes → Shows modal with protocol link
   - Example: User has USDC on Ethereum, wants Aave on Arbitrum
   - Set fromChain: Ethereum, chain: Arbitrum

3. **Bridge-only operations:**
   - User clicks button → Routes to /bridge
   - No deposit action after

4. **Swap operations:**
   - User clicks button → Routes to /swap
   - Uses Wormhole swap widget

Guidelines:
- Be concise but informative
- Prioritize user safety and risk management
- Suggest realistic, actionable strategies
- When wallet is connected, analyze their actual holdings
- When wallet is not connected, provide general DeFi education
`;

    if (walletConnected && portfolioContext) {
      // Defensive type checking for totalValueUSD
      const totalValue = typeof portfolioContext.totalValueUSD === 'string' 
        ? parseFloat(portfolioContext.totalValueUSD) 
        : portfolioContext.totalValueUSD;
      
      console.log('💰 Portfolio totalValueUSD type:', typeof portfolioContext.totalValueUSD, 'value:', totalValue);
      
      if (totalValue > 0) {
        systemPrompt += `\n\n**📊 USER'S REAL PORTFOLIO DATA (DO NOT INVENT - USE ONLY THIS):**
\`\`\`json
${JSON.stringify(portfolioContext, null, 2)}
\`\`\`

Total Value: $${totalValue.toFixed(2)}
Holdings: ${portfolioContext.holdings?.length || 0} assets across ${portfolioContext.chainCount || 0} chains
Top Holdings:
${portfolioContext.topHoldings?.map((h: any) => {
  const holdingValue = typeof h.valueUSD === 'string' ? parseFloat(h.valueUSD) : h.valueUSD;
  return `  - ${h.token} on ${h.chain}: $${holdingValue?.toFixed(2)} (${h.amount} ${h.token})`;
}).join('\n') || '  - None'}

**Use this EXACT data when discussing their portfolio. Do not add or modify any values.**`;
      } else {
        systemPrompt += `\n\n**Wallet Status:** Connected but no assets detected. User has 0 balance. Suggest ways to acquire assets or explain DeFi strategies for when they get funds.`;
      }
    } else if (walletConnected && !portfolioContext) {
      systemPrompt += `\n\n**Wallet Status:** Connected but no assets detected. User has 0 balance. Suggest ways to acquire assets or explain DeFi strategies for when they get funds.`;
    }

    // Add REAL yield data to system prompt
    if (yieldData && yieldData.length > 0) {
      systemPrompt += `\n\n**🔴 CRITICAL: REAL YIELD DATA FROM DEFI LLAMA (USE THESE EXACT VALUES)**

You have access to ${yieldData.length} REAL yield opportunities from DeFi Llama API.

**MANDATORY INSTRUCTIONS - READ CAREFULLY:**
1. Output [EXECUTE_CARD] for EXACTLY 5-7 yields (NOT just 1 or 2)
2. Do NOT make up yields - use ONLY the data provided below
3. Do NOT be lazy - output MULTIPLE cards (5-7 minimum)
4. Use exact APY, TVL, protocol, token, chain from the data below
5. Each card must be properly formatted with [EXECUTE_CARD] tags

**TOP 10 REAL YIELD OPPORTUNITIES (Pre-filtered for Wormhole compatibility):**
${JSON.stringify(yieldData.slice(0, 10), null, 2)}

**IMPORTANT: These yields have been pre-validated. Do NOT suggest any Base + ETH yields as they are already filtered out.**

**EXACT FORMAT TO USE (repeat for 5-7 different yields):**

[EXECUTE_CARD]
type: cross_chain_yield
protocol: {exact protocol name from data above}
token: {exact token symbol from data above}
chain: {exact chain name from data above}
fromChain: Ethereum
amount: 1000
estimatedGas: $2.34
executionTime: 12 seconds
apy: {exact APY from data above}
[/EXECUTE_CARD]

**EXAMPLE - You should output 5-7 cards like this:**

[EXECUTE_CARD]
type: cross_chain_yield
protocol: Aave
token: USDC
chain: Arbitrum
fromChain: Ethereum
amount: 1000
estimatedGas: $2.34
executionTime: 12 seconds
apy: 8.5
[/EXECUTE_CARD]

[EXECUTE_CARD]
type: cross_chain_yield
protocol: Compound
token: USDC
chain: Optimism
fromChain: Ethereum
amount: 1000
estimatedGas: $1.89
executionTime: 10 seconds
apy: 7.2
[/EXECUTE_CARD]

... (continue for at least 5-7 total cards)

**CRITICAL: DO NOT OUTPUT JUST 1-2 CARDS. MUST OUTPUT 5-7 CARDS MINIMUM.**
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
