import { useState, useEffect } from 'react';
import { MINI_GIGS_ABI } from '@/lib/abi';
import { MINIGIGS_CONTRACT_ADDRESS, Gig, GigStatus } from '@/lib/constants';
import { formatEther, decodeFunctionResult } from 'viem';

// Verified correct keccak256 selectors:
// gigCount()    => 0x3689e916
// gigs(uint256) => 0x5e3fbdc8
const GIGS_COUNT_SELECTOR = '0x3689e916';
const GIGS_SELECTOR = '0x5e3fbdc8';
const RPC_URLS = [
    'https://forno.celo.org',
    'https://rpc.ankr.com/celo',
];

async function rpcCall(data: string, rpcUrl: string) {
    const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'eth_call',
            params: [{ to: MINIGIGS_CONTRACT_ADDRESS, data }, 'latest']
        })
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
        } catch (e) {
            console.warn(`RPC ${url} failed, trying next...`);
        }
    }
    return null;
}

export function useGigs() {
    const [gigs, setGigs] = useState<Gig[]>([]);
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

    // Step 2: Fetch gig details whenever count changes
    useEffect(() => {
        if (gigCount === 0) {
            setIsLoading(false);
            return;
        }

        async function fetchGigs() {
            setIsLoading(true);
            const fetchedGigs: Gig[] = [];

            // Fetch the last 20 gigs (newest first)
            const limit = Math.min(gigCount, 20);
            const start = gigCount - limit + 1;

            console.log(`📡 Fetching gigs ${start} to ${gigCount}...`);

            for (let i = gigCount; i >= start; i--) {
                try {
                    const calldata = `${GIGS_SELECTOR}${BigInt(i).toString(16).padStart(64, '0')}`;
                    const result = await rpcCallWithFallback(calldata);

                    if (!result || result === '0x') continue;

                    const data: any = decodeFunctionResult({
                        abi: MINI_GIGS_ABI,
                        functionName: 'gigs',
                        data: result as `0x${string}`
                    });

                    if (!data) continue;

                    const statusMap: GigStatus[] = ['open', 'in_progress', 'submitted', 'completed', 'disputed', 'cancelled'];

                    // viem returns named properties for named tuple fields
                    const rawDesc = (data.description ?? data[5] ?? '') as string;
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
                    } catch (_) {}

                    const statusIdx = Number(data.status ?? data[6] ?? 0);
                    const workerAddr = (data.worker ?? data[2] ?? '') as string;

                    fetchedGigs.push({
                        id: i.toString(),
                        poster: (data.poster ?? data[1] ?? '') as string,
                        worker: workerAddr === '0x0000000000000000000000000000000000000000' ? null : workerAddr,
                        bounty: Number(formatEther((data.bounty ?? data[3] ?? BigInt(0)) as bigint)),
                        title: (data.title ?? data[4] ?? `Gig #${i}`) as string,
                        description: finalDesc,
                        category: finalCat,
                        status: statusMap[statusIdx] ?? 'open',
                        verification: finalVer,
                        timeEstimate: finalTime,
                        createdAt: Number(data.createdAt ?? data[8] ?? 0) * 1000,
                    });
                } catch (e) {
                    console.error(`Failed to fetch gig #${i}:`, e);
                }
            }

            console.log(`✅ Loaded ${fetchedGigs.length} gigs`);
            setGigs(fetchedGigs);
            setIsLoading(false);
        }

        fetchGigs();
    }, [gigCount]);

    return { gigs, isLoading, gigCount };
}
