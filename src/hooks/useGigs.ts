import { useState, useEffect } from 'react';
import { MINI_GIGS_ABI } from '@/lib/abi';
import { MINIGIGS_CONTRACT_ADDRESS, Gig, GigStatus } from '@/lib/constants';
import { formatEther, decodeFunctionResult, encodeFunctionData } from 'viem';

// Verified correct keccak256 selectors:
// gigCount()    => 0x3689e916
// gigs(uint256) => 0x5e3fbdc8
const GIGS_COUNT_SELECTOR = '0x3689e916';
const GIGS_SELECTOR = '0x5e3fbdc8';
const RPC_URLS = ['https://forno.celo.org', 'https://rpc.ankr.com/celo'];

const MULTICALL3_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'target', type: 'address' },
          { internalType: 'bool', name: 'allowFailure', type: 'bool' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
        ],
        internalType: 'struct Multicall3.Call3[]',
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        components: [
          { internalType: 'bool', name: 'success', type: 'bool' },
          { internalType: 'bytes', name: 'returnData', type: 'bytes' },
        ],
        internalType: 'struct Multicall3.Result[]',
        name: 'returnData',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

async function rpcCall(data: string, rpcUrl: string) {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'eth_call',
      params: [{ to: MINIGIGS_CONTRACT_ADDRESS, data }, 'latest'],
    }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

async function rpcCallWithFallback(data: string): Promise<string | null> {
  for (const url of RPC_URLS) {
    try {
      const result = await rpcCall(data, url);
      if (result && result !== '0x') return result;
    } catch {
      console.warn(`RPC ${url} failed, trying next...`);
    }
  }
  return null;
}

export function useGigs() {
  const [gigs, setGigs] = useState<Gig[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('minigigs_cache');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [gigCount, setGigCount] = useState<number>(0);

  // Step 1: Fetch gig count
  useEffect(() => {
    async function fetchCount() {
      try {
        const result = await rpcCallWithFallback(GIGS_COUNT_SELECTOR);
        if (result) {
          const count = parseInt(result, 16);
          console.log('✅ Gig count:', count);
          setGigCount(count);
        }
      } catch (e) {
        console.error('Failed to fetch gig count:', e);
      }
    }
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchGigs() {
      if (gigCount === 0) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      // Fetch the last 20 gigs (newest first)
      const limit = Math.min(gigCount, 20);
      const gigIds = Array.from({ length: limit }, (_, i) => BigInt(gigCount - i));

      try {
        console.log(`📡 Fetching ${limit} gigs via Multicall...`);

        // Create multicall params
        const calls = gigIds.map((id) => ({
          target: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
          allowFailure: true,
          callData: `${GIGS_SELECTOR}${id.toString(16).padStart(64, '0')}` as `0x${string}`,
        }));

        let res;
        let json;
        for (const url of RPC_URLS) {
          try {
            res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'eth_call',
                params: [
                  {
                    to: '0xcA11bde05977b3631167028862bE2a173976CA11', // Multicall3 on Celo
                    data: encodeFunctionData({
                      abi: MULTICALL3_ABI,
                      functionName: 'aggregate3',
                      args: [calls],
                    }),
                  },
                  'latest',
                ],
              }),
            });
            json = await res.json();
            if (!json.error) break;
          } catch (err) {
            console.warn(`Multicall failed on ${url}, trying next...`);
          }
        }

        if (!json || json.error) throw new Error(json?.error?.message || 'All RPCs failed');

        const multicallResult = decodeFunctionResult({
          abi: MULTICALL3_ABI,
          functionName: 'aggregate3',
          data: json.result,
        }) as readonly { success: boolean; returnData: `0x${string}` }[];

        const results = multicallResult.map((r) => (r.success ? r.returnData : '0x'));
        const fetchedGigs: Gig[] = [];

        results.forEach((result, idx) => {
          if (!result || result === '0x') return;

          try {
            const data = decodeFunctionResult({
              abi: MINI_GIGS_ABI,
              functionName: 'gigs',
              data: result,
            }) as readonly unknown[];

            const statusMap: GigStatus[] = [
              'open',
              'in_progress',
              'submitted',
              'completed',
              'disputed',
              'cancelled',
              'expired',
            ];

            const rawDesc = (data[5] as string) || '';
            let finalDesc = rawDesc;
            let finalCat = 'other';
            let finalVer = 'none';
            let finalTime = '3h';

            try {
              if (rawDesc.startsWith('{')) {
                const meta = JSON.parse(rawDesc);
                finalDesc = meta.desc || rawDesc;
                finalCat = meta.cat || 'other';
                finalVer = meta.ver || 'none';
                finalTime = meta.time || '3h';
              }
            } catch {
              // Ignore JSON parse errors
            }

            fetchedGigs.push({
              id: gigIds[idx].toString(),
              poster: data[1] as string,
              worker:
                (data[2] as string) === '0x0000000000000000000000000000000000000000'
                  ? null
                  : (data[2] as string),
              bounty: Number(formatEther(data[3] as bigint)),
              title: (data[4] as string) || `Gig #${gigIds[idx]}`,
              description: finalDesc,
              category: finalCat,
              status: statusMap[Number(data[6] as number)] ?? 'open',
              verification: finalVer,
              timeEstimate: finalTime,
              createdAt: Number(data[8] as bigint) * 1000,
            });
          } catch (e) {
            console.error(`Failed to decode gig #${gigIds[idx]}:`, e);
          }
        });
        setGigs(fetchedGigs);
        localStorage.setItem('minigigs_cache', JSON.stringify(fetchedGigs));
      } catch (e) {
        console.error('Multicall failed:', e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGigs();
  }, [gigCount]);

  return { gigs, isLoading, gigCount };
}
