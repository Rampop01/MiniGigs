import { useState, useEffect } from 'react';
import { usePublicClient, useReadContract } from 'wagmi';
import { MINI_GIGS_ABI } from '@/lib/abi';
import { MINIGIGS_CONTRACT_ADDRESS, Gig } from '@/lib/constants';
import { formatEther } from 'viem';

export function useGigs() {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const publicClient = usePublicClient();

    const { data: gigCount } = useReadContract({
        address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
        abi: MINI_GIGS_ABI,
        functionName: 'gigCount',
        query: { refetchInterval: 3000 }, // Poll every 3s
    });

    useEffect(() => {
        async function fetchGigs() {
            if (!gigCount || !publicClient) return;

            try {
                const count = Number(gigCount);
                const fetchedGigs: Gig[] = [];

                const contracts = [];
                for (let i = 1; i <= count; i++) {
                    contracts.push({
                        address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
                        abi: MINI_GIGS_ABI,
                        functionName: 'gigs',
                        args: [BigInt(i)],
                    });
                }

                const results = await publicClient.multicall({
                    contracts: contracts as any,
                });

                results.forEach((res: any, index) => {
                    if (res.status === 'success' && res.result) {
                        const data = res.result;
                        const statusMap: any[] = ['open', 'in_progress', 'submitted', 'completed', 'disputed', 'cancelled'];

                        let finalDesc = data[5];
                        let finalCat = 'other';
                        let finalVer = 'none';
                        let finalTime = '3h';
                        try {
                            if (data[5] && typeof data[5] === 'string' && data[5].startsWith('{')) {
                                const meta = JSON.parse(data[5]);
                                finalDesc = meta.desc || data[5];
                                finalCat = meta.cat || 'other';
                                finalVer = meta.ver || 'none';
                                finalTime = meta.time || '3h';
                            }
                        } catch (e) {}

                        fetchedGigs.push({
                            id: Number(data[0]).toString(),
                            poster: data[1],
                            worker: data[2],
                            bounty: Number(formatEther(data[3])),
                            title: data[4],
                            description: finalDesc,
                            category: finalCat,
                            status: statusMap[data[6]] || 'open',
                            verification: finalVer,
                            timeEstimate: finalTime,
                            createdAt: Number(data[8]) * 1000,
                        });
                    }
                });

                setGigs(fetchedGigs.reverse());
            } catch (error) {
                console.error('Failed to fetch gigs', error);
            } finally {
                setIsLoading(false);
            }
        }

        if (gigCount) {
            fetchGigs();
        } else {
            setIsLoading(false);
        }
    }, [gigCount, publicClient]);

    return { gigs, isLoading, gigCount };
}
