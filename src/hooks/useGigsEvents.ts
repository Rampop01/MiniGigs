'use client';

import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { MINI_GIGS_ABI } from '@/lib/abi';
import { MINIGIGS_CONTRACT_ADDRESS } from '@/lib/constants';
import toast from 'react-hot-toast';

export type GigEvent = {
  type: 'posted' | 'accepted' | 'submitted' | 'completed' | 'cancelled';
  gigId: bigint;
  timestamp: number;
  data: Record<string, unknown>;
};

export function useGigsEvents() {
  const [events, setEvents] = useState<GigEvent[]>([]);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!publicClient) return;

    console.log('📡 Starting real-time gig event subscription...');

    const unwatch = publicClient.watchContractEvent({
      address: MINIGIGS_CONTRACT_ADDRESS,
      abi: MINI_GIGS_ABI,
      onLogs: (logs) => {
        logs.forEach((log) => {
          const { eventName, args } = log as {
            eventName: string;
            args: { gigId?: bigint; id?: bigint };
          };
          if (!eventName) return;

          const newEvent: GigEvent = {
            type: eventName.toLowerCase().replace('gig', '') as GigEvent['type'],
            gigId: args.gigId || args.id || 0n,
            timestamp: Date.now(),
            data: args as unknown as Record<string, unknown>,
          };

          setEvents((prev) => [newEvent, ...prev].slice(0, 50));

          // Real-time notifications
          if (eventName === 'GigPosted') {
            toast.success(`New Gig #${args.gigId} Posted!`, { icon: '🚀' });
          } else if (eventName === 'GigCompleted') {
            toast.success(`Gig #${args.gigId} Completed!`, { icon: '💰' });
          }
        });
      },
    });

    return () => unwatch();
  }, [publicClient]);

  return { events };
}
