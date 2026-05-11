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

export function useGigsEvents(userAddress?: `0x${string}`) {
  const [events, setEvents] = useState<GigEvent[]>([]);
  const [userEvents, setUserEvents] = useState<GigEvent[]>([]);
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

          // Filter for user-specific events
          if (userAddress) {
            const gigArgs = args as Record<string, unknown>;
            const poster = (gigArgs.poster as string | undefined)?.toLowerCase();
            const worker = (gigArgs.worker as string | undefined)?.toLowerCase();
            const isRelevant =
              poster === userAddress.toLowerCase() || worker === userAddress.toLowerCase();

            if (isRelevant) {
              setUserEvents((prev) => [newEvent, ...prev].slice(0, 20));
            }
          }

          // Real-time notifications
          const gigArgs = args as Record<string, unknown>;
          if (eventName === 'GigPosted') {
            toast.success(`New Gig #${args.gigId} is now live!`, { icon: '🚀' });
          } else if (eventName === 'GigAccepted') {
            const isUser = (gigArgs.worker as string | undefined)?.toLowerCase() === userAddress?.toLowerCase();
            toast(isUser ? `You accepted Gig #${args.gigId}!` : `Gig #${args.gigId} was accepted`, { icon: '🤝' });
          } else if (eventName === 'GigSubmitted') {
            toast(`Work submitted for Gig #${args.gigId}`, { icon: '📤' });
          } else if (eventName === 'GigCompleted') {
            const poster = (gigArgs.poster as string | undefined)?.toLowerCase();
            const worker = (gigArgs.worker as string | undefined)?.toLowerCase();
            const isUser = poster === userAddress?.toLowerCase() || worker === userAddress?.toLowerCase();
            toast.success(isUser ? `Gig #${args.gigId} settled! Check your wallet.` : `Gig #${args.gigId} completed`, { icon: '💰' });
          }
        });
      },
    });

    return () => unwatch();
  }, [publicClient, userAddress]);

  return { events, userEvents };
}
