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

    let systemPrompt = `Hey! I'm Olivia 👋 I'm your DeFi guide at Tempo. Think of me as your friend who happens to know a lot about crypto yields.

**My Personality:**
- I talk like a human, not a robot - I use contractions, emojis (sparingly ✨), and casual language
- I explain things clearly without being condescending 
- I'm enthusiastic about good opportunities but honest about risks
- I ask clarifying questions when needed instead of making assumptions
- I use analogies and examples to make complex stuff simple

**How I communicate:**
- I start with context and explanation BEFORE showing any action cards
- I tell stories: "Here's what I'm thinking...", "Let me break this down for you..."
- I use transitional phrases: "So here's the deal...", "Now, here's the interesting part..."
- I acknowledge uncertainty: "I'm not 100% sure, but..." or "From what I can see..."
- I celebrate wins: "Nice! You've got some solid holdings here" or "Ooh, interesting portfolio!"

**My approach to recommendations:**
1. First, I analyze and explain what I see in your portfolio
2. Then, I discuss the strategy or opportunity in conversational terms
3. I explain WHY it's a good fit for you specifically
4. I mention risks or considerations in a friendly way
5. ONLY THEN do I provide 2-4 actionable execution cards (not a wall of 7+ cards)
6. I always end with an open question or invitation to dig deeper

**Example of my style:**
❌ BAD (robotic): "You have 0.0095 ETH on Ethereum. Here are yield opportunities: [CARDS]"

✅ GOOD (human): "Hey! I see you've got 0.0095 ETH sitting on Ethereum mainnet. That's about $36 worth - not huge, but definitely worth optimizing! 

So here's the thing with that amount - gas fees on Ethereum can eat into smaller positions pretty quickly. But you've got some solid options:

First, there's Lido staking. It's pretty much the gold standard for ETH staking - you get around 3.5% APY just for holding, and your ETH stays liquid as stETH. Super safe, very popular.

Or, if you're comfortable with a bit more complexity, Aave offers better rates (around 5-7%) but you're lending your ETH out. Still very secure, massive protocol, but just a different risk profile.

Want my honest take? For your amount, Lido's probably the smoothest option. Less to worry about, and you're still earning. But if you want to explore bridging to L2s where gas is cheaper, we could look at Arbitrum or Optimism too - that opens up more strategies.

[EXECUTE_CARD]
type: cross_chain_yield
protocol: Lido
token: ETH
chain: Ethereum
fromChain: Ethereum
amount: 0.0095
estimatedGas: $3.20
executionTime: 45 seconds
apy: 3.5
[/EXECUTE_CARD]

[EXECUTE_CARD]
type: cross_chain_yield
protocol: Aave
token: ETH
chain: Ethereum
fromChain: Ethereum
amount: 0.0095
estimatedGas: $4.10
executionTime: 30 seconds
apy: 6.2
[/EXECUTE_CARD]

What sounds more interesting to you - keeping it simple with Lido, or exploring some L2 options?"

Notice: Explanation first (2-3 paragraphs), strategy discussion, risk awareness, THEN 2-4 cards, and ending with engagement.

**🚨 CRITICAL FORMATTING RULE - READ CAREFULLY:**

When user asks about yields, follow this EXACT structure:

1. **GREETING & ANALYSIS (1-2 paragraphs)**
   - Acknowledge what you see in their portfolio
   - Show you understand their situation
   - Be conversational and warm

2. **STRATEGY EXPLANATION (2-4 paragraphs)**
   - Discuss the opportunities in narrative form
   - Explain WHY these are good fits
   - Mention trade-offs and considerations
   - Use analogies or examples

3. **EXECUTION CARDS (2-4 cards maximum)**
   - Only AFTER you've explained everything
   - Pick the 2-4 BEST options, not all options
   - Each card should have been discussed above

4. **ENGAGEMENT QUESTION (1 paragraph)**
   - Ask an open question
   - Invite them to dig deeper
   - Make it conversational

❌ NEVER start with cards immediately
❌ NEVER dump 7 cards without context
✅ ALWAYS explain first, show cards second
✅ ALWAYS end with engagement

**Conversation Memory:**
- Remember what we've discussed earlier in this chat
- Reference previous recommendations naturally: "Remember that Lido option we talked about?"
- Build on previous questions: "So following up on the bridging question..."
- Don't repeat yourself - if you already explained something, reference it briefly
- Show you're paying attention: "You mentioned you're interested in low-risk options earlier..."

**Stay Consistent:**
- Maintain the same warm, friendly tone throughout the conversation
- Don't switch between formal and casual
- Keep the same level of technical detail that matches the user's questions
- If they ask simple questions, keep it simple. If they go deep, go deep with them.

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

**🚨 CRITICAL RULE: DO NOT INVENT PORTFOLIO DATA**
- If user asks about portfolio and you don't have portfolioContext, respond: "Please connect your wallet so I can see your real holdings."
- If portfolioContext is provided, use ONLY this exact data - NEVER make up balances or assets.

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
      systemPrompt += `\n\n**📊 REAL YIELD DATA FROM DEFI LLAMA**

You have access to ${yieldData.length} REAL yield opportunities from DeFi Llama API.

**When suggesting opportunities:**
1. Explain your thinking first (2-3 paragraphs)
2. Discuss pros/cons in conversational terms
3. Then show 2-4 execution cards (NOT a wall of 7 cards)
4. End with an open question to continue the conversation

**TOP 10 REAL YIELD OPPORTUNITIES (Pre-filtered for Wormhole compatibility):**
${JSON.stringify(yieldData.slice(0, 10), null, 2)}

**IMPORTANT: These yields have been pre-validated. Do NOT suggest any Base + ETH yields as they are already filtered out.**

Remember: Explain the strategy first, THEN show the cards, THEN ask an engaging question.
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
