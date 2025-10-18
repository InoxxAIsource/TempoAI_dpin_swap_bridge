import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Intercepts CoinGecko API calls and proxies them through our Edge Function
 * to bypass CORS restrictions. This is necessary because Wormhole Connect
 * makes direct CoinGecko calls from the browser.
 */
export const useCoinGeckoProxy = () => {
  useEffect(() => {
    const originalFetch = window.fetch;
    let isInterceptorActive = true;

    // Override fetch globally
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (!isInterceptorActive) {
        return originalFetch(input, init);
      }

      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      
      // Check if this is a CoinGecko API call
      const isCoinGeckoCall = url.includes('api.coingecko.com/api/v3');
      
      if (isCoinGeckoCall) {
        console.log('🔄 Intercepting CoinGecko request:', url);
        
        try {
          // Extract token IDs from different CoinGecko endpoints
          let tokenIds: string[] = [];
          
          // Handle /simple/price endpoint
          if (url.includes('/simple/price')) {
            const urlObj = new URL(url);
            const ids = urlObj.searchParams.get('ids');
            if (ids) {
              tokenIds = ids.split(',');
            }
          }
          
          // Handle /simple/token_price endpoint  
          if (url.includes('/simple/token_price')) {
            const urlObj = new URL(url);
            const addresses = urlObj.searchParams.get('contract_addresses');
            if (addresses) {
              // Map contract addresses to token IDs
              const addressMap: Record<string, string> = {
                '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': 'weth',
                '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': 'usd-coin',
                '0xdAC17F958D2ee523a2206206994597C13D831ec7': 'tether',
                '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 'wrapped-bitcoin',
              };
              
              tokenIds = addresses.split(',').map(addr => 
                addressMap[addr.toLowerCase()] || 'ethereum'
              );
            }
          }

          // Handle /coins/{id} endpoint
          if (url.match(/\/coins\/[\w-]+$/)) {
            const match = url.match(/\/coins\/([\w-]+)/);
            if (match) {
              tokenIds = [match[1]];
            }
          }

          if (tokenIds.length === 0) {
            console.warn('⚠️ Could not extract token IDs from URL, using fallback');
            tokenIds = ['ethereum', 'weth', 'usd-coin'];
          }

          // Call our Edge Function instead
          const { data, error } = await supabase.functions.invoke('fetch-token-prices', {
            body: { tokenIds: tokenIds.filter(Boolean) }
          });

          if (error) {
            console.error('❌ Proxy error:', error);
            // Fallback to original fetch
            return originalFetch(input, init);
          }

          console.log('✅ Proxied CoinGecko response:', data);

          // Return a Response object that mimics CoinGecko's response
          return new Response(JSON.stringify(data), {
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
          
        } catch (error) {
          console.error('❌ Fetch interceptor error:', error);
          // Fallback to original fetch (will fail with CORS, but won't break the app)
          return originalFetch(input, init);
        }
      }
      
      // Not a CoinGecko call, use original fetch
      return originalFetch(input, init);
    };

    console.log('🎣 CoinGecko fetch interceptor installed');

    // Cleanup: restore original fetch on unmount
    return () => {
      isInterceptorActive = false;
      window.fetch = originalFetch;
      console.log('🧹 CoinGecko fetch interceptor removed');
    };
  }, []);
};
