'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import BottomNav, { TabId } from '@/components/BottomNav';
import CategoryFilter from '@/components/CategoryFilter';
import StatsBanner from '@/components/StatsBanner';
import GigCard from '@/components/GigCard';
import GigDetail from '@/components/GigDetail';
import CreateGig from '@/components/CreateGig';
import AgentHub from '@/components/AgentHub';
import SelfClawBadge from '@/components/SelfClawBadge';
import AdminPanel from '@/components/AdminPanel';
import ActivityFeed from '@/components/ActivityFeed';
import SearchBar from '@/components/SearchBar';
import FilterChips from '@/components/FilterChips';
import SortDropdown from '@/components/SortDropdown';
import { Gig, MINIGIGS_CONTRACT_ADDRESS, CUSD_ADDRESS } from '@/lib/constants';
import { useAccount, useBalance, useWriteContract } from 'wagmi';
import { MINI_GIGS_ABI } from '@/lib/abi';
import { useGigs } from '@/hooks/useGigs';
import {
  Info,
  Plus,
  ChevronRight,
  Award,
  Settings,
  CheckCircle,
  Loader2,
  ClipboardCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import styles from './page.module.css';

import { useSearchParams, useRouter } from 'next/navigation';

export default function MarketplacePage({ filter }: { filter?: 'all' | 'my' }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get('tab') as TabId) || 'explore';
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [now] = useState(() => Date.now());

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { gigs: liveGigs, isLoading: isGigsLoading } = useGigs();

  // ── Tab: Explore (The Marketplace) ──
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredGigs = useMemo(() => {
    let result = liveGigs;
    if (filter === 'my' && address) {
      result = liveGigs.filter((g) => g.poster === address || g.worker === address);
    }
    if (selectedCategory !== 'all') {
      result = result.filter((g) => g.category === selectedCategory);
    }
    if (statusFilter !== 'all') {
      result = result.filter((g) => g.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      if (sortOrder === 'bounty-high') return b.bounty - a.bounty;
      if (sortOrder === 'deadline-soon') return a.createdAt - b.createdAt; // Oldest first as proxy for ending soon
      return b.createdAt - a.createdAt; // newest
    });
    
    return result;
  }, [selectedCategory, statusFilter, searchQuery, sortOrder, liveGigs, filter, address]);

  const ExploreView = () => {
    const openGigs = liveGigs.filter((g) => g.status === 'open').length;
    const totalBounty = liveGigs.reduce((acc, g) => acc + (g.status === 'open' ? g.bounty : 0), 0);

    return (
      <div className={`${styles.tabContent} anim-slide-up`}>
        <StatsBanner openGigs={openGigs} totalBounty={totalBounty} />
        <ActivityFeed />

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Marketplace{' '}
            {isGigsLoading && <Loader2 className="animate-spin inline-block ml-2" size={16} />}
          </h2>
          <button className={styles.addBtn} onClick={() => setShowCreateModal(true)}>
            <Plus size={18} /> Post Gig
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
          <SearchBar onSearch={setSearchQuery} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <FilterChips 
              options={[
                { id: 'all', label: 'All Status' },
                { id: 'open', label: 'Open' },
                { id: 'in_progress', label: 'Active' },
                { id: 'completed', label: 'Done' }
              ]} 
              activeId={statusFilter} 
              onChange={setStatusFilter} 
            />
            <SortDropdown 
              options={[
                { id: 'newest', label: 'Newest' },
                { id: 'bounty-high', label: 'Highest Bounty' },
                { id: 'deadline-soon', label: 'Ending Soon' }
              ]} 
              activeId={sortOrder} 
              onChange={setSortOrder} 
            />
          </div>
        </div>

        <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />

        <div className={styles.gigGrid}>
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} now={now} onClick={() => setSelectedGig(gig)} />
            ))
          ) : (
            <div className={styles.emptyState}>No gigs match your filters.</div>
          )}
        </div>
      </div>
    );
  };

  // ── Tab: My Tasks (For Workers) ──
  const myTasks = useMemo(() => {
    if (!address) return [];
    return liveGigs.filter(
      (g) =>
        g.worker?.toLowerCase() === address.toLowerCase() &&
        g.status !== 'completed' &&
        g.status !== 'cancelled',
    );
  }, [liveGigs, address]);

  const MyTasksView = () => (
    <div className={`${styles.tabContent} anim-slide-up`}>
      <h2 className={styles.pageTitle}>My Tasks</h2>

      {myTasks.length > 0 ? (
        <div className={styles.gigGrid}>
          {myTasks.map((gig) => (
            <GigCard key={gig.id} gig={gig} now={now} onClick={() => setSelectedGig(gig)} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ClipboardCheck size={48} color="var(--text-tertiary)" />
          </div>
          <h3>No active tasks</h3>
          <p>Complete your tasks to unlock new micro-gigs.</p>
          <button
            className="btn-primary"
            style={{ marginTop: 'var(--sp-4)' }}
            onClick={() => router.push('/marketplace?tab=explore')}
          >
            Browse Markets
          </button>
        </div>
      )}
    </div>
  );

  // ── Tab: Wallet (Finances) ──
  const WalletView = () => {
    const { data: balance } = useBalance({
      address: address,
      token: CUSD_ADDRESS as `0x${string}`,
    });

    return (
      <div className={`${styles.tabContent} anim-slide-up`}>
        <h2 className={styles.pageTitle}>Finance</h2>

        <div className={`${styles.balanceCard}`}>
          <span className={styles.balanceLabel}>Total Balance</span>
          <div className={styles.balanceValue}>
            {balance ? Number(balance.formatted).toFixed(2) : '0.00'} <span>cUSD</span>
          </div>
          <div className={styles.balanceActions}>
            <button className="btn-primary" style={{ flex: 1 }}>
              Withdraw
            </button>
            <button
              className="btn-primary"
              style={{
                flex: 1,
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
              }}
            >
              Deposit
            </button>
          </div>
        </div>

        <div className={styles.listSection}>
          <h3 className={styles.listTitle}>Payout History</h3>
          {liveGigs.filter(
            (g) =>
              g.status === 'completed' &&
              (g.worker?.toLowerCase() === address?.toLowerCase() ||
                g.poster?.toLowerCase() === address?.toLowerCase()),
          ).length > 0 ? (
            liveGigs
              .filter(
                (g) =>
                  g.status === 'completed' &&
                  (g.worker?.toLowerCase() === address?.toLowerCase() ||
                    g.poster?.toLowerCase() === address?.toLowerCase()),
              )
              .map((gig) => (
                <div key={gig.id} className={styles.listItem}>
                  <div className={styles.listIcon} style={{ background: 'var(--primary-subtle)' }}>
                    <CheckCircle size={16} color="var(--primary)" />
                  </div>
                  <div className={styles.listInfo}>
                    <strong>{gig.title}</strong>
                    <span>
                      {gig.worker?.toLowerCase() === address?.toLowerCase() ? 'Earned' : 'Paid'} ·{' '}
                      {new Date(gig.createdAt * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div
                    className={styles.listAmount}
                    style={{
                      color:
                        gig.worker?.toLowerCase() === address?.toLowerCase()
                          ? 'var(--accent-green)'
                          : 'var(--accent-rose)',
                    }}
                  >
                    {gig.worker?.toLowerCase() === address?.toLowerCase() ? '+' : '-'}
                    {gig.bounty.toFixed(2)}
                  </div>
                </div>
              ))
          ) : (
            <div className={styles.emptyListItem}>No recent payouts</div>
          )}
        </div>
      </div>
    );
  };

  // ── Tab: Profile (Reputation) ──
  const ProfileView = () => (
    <div className={`${styles.tabContent} anim-slide-up`}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{address ? address.slice(2, 4).toUpperCase() : 'MG'}</div>
        <h2 className={styles.profileName}>
          {isConnected
            ? address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : 'Connected'
            : 'Guest User'}
        </h2>
        <div className="flex flex-col items-center gap-2">
          <span className={styles.reputationBadge}>
            <Award size={14} /> MiniGigs Pro Worker
          </span>
          <SelfClawBadge />
        </div>
        <div className="w-full mt-4 space-y-1 px-8">
          <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
            <span>LVL 12</span>
            <span>85% to Next</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '85%' }} />
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statVal}>
            {
              liveGigs.filter(
                (g) =>
                  g.worker?.toLowerCase() === address?.toLowerCase() && g.status === 'completed',
              ).length
            }
          </span>
          <span className={styles.statLab}>Finished</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statVal}>
            $
            {liveGigs
              .filter(
                (g) =>
                  g.worker?.toLowerCase() === address?.toLowerCase() && g.status === 'completed',
              )
              .reduce((acc, g) => acc + g.bounty, 0)
              .toFixed(0)}
          </span>
          <span className={styles.statLab}>Earned</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statVal}>100%</span>
          <span className={styles.statLab}>Trust</span>
        </div>
      </div>

      <div className={styles.menuList}>
        <div className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <Settings size={18} />
          </div>
          <span>Platform Settings</span>
          <ChevronRight size={16} />
        </div>
        <div className={styles.menuItem}>
          <div className={styles.menuIcon}>
            <Info size={18} />
          </div>
          <span>Support Center</span>
          <ChevronRight size={16} />
        </div>
      </div>

      <AdminPanel />
    </div>
  );

  return (
    <>
      <main className={styles.main}>
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'my-tasks' && <MyTasksView />}
        {activeTab === 'agents' && <AgentHub />}
        {activeTab === 'wallet' && <WalletView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {selectedGig && (
        <GigDetail
          gig={selectedGig}
          onClose={() => setSelectedGig(null)}
          onAccept={async (gig) => {
            if (!isConnected || !address) {
              toast.error('Connect your wallet first');
              return;
            }

            try {
              if (gig.status === 'open') {
                toast.loading('Accepting gig...', { id: 'gig-action' });
                await writeContractAsync({
                  address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
                  abi: MINI_GIGS_ABI,
                  functionName: 'acceptGig',
                  args: [BigInt(gig.id)],
                  // @ts-expect-error - external - feeCurrency is supported on Celo
                  feeCurrency: CUSD_ADDRESS as `0x${string}`,
                });
                toast.success('Gig accepted! Go to My Tasks.', { id: 'gig-action' });
              } else if (
                gig.status === 'in_progress' &&
                gig.worker?.toLowerCase() === address.toLowerCase()
              ) {
                toast.loading('Submitting work...', { id: 'gig-action' });
                await writeContractAsync({
                  address: MINIGIGS_CONTRACT_ADDRESS,
                  abi: MINI_GIGS_ABI,
                  functionName: 'submitWork',
                  args: [BigInt(gig.id), 'Proof of work: Job completed successfully.'],
                  // @ts-expect-error - external - feeCurrency is supported on Celo
                  feeCurrency: CUSD_ADDRESS as `0x${string}`,
                });
                toast.success('Work submitted for review!', { id: 'gig-action' });
              } else if (
                gig.status === 'submitted' &&
                gig.poster?.toLowerCase() === address.toLowerCase()
              ) {
                toast.loading('Releasing funds...', { id: 'gig-action' });
                await writeContractAsync({
                  address: MINIGIGS_CONTRACT_ADDRESS,
                  abi: MINI_GIGS_ABI,
                  functionName: 'completeGig',
                  args: [BigInt(gig.id)],
                  // @ts-expect-error - external - feeCurrency is supported on Celo
                  feeCurrency: CUSD_ADDRESS as `0x${string}`,
                });
                toast.success('Funds released to worker!', { id: 'gig-action' });
                confetti({
                  particleCount: 150,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#35D07F', '#FBCC5C', '#616161'],
                });
              }
              setSelectedGig(null);
            } catch (error: unknown) {
              const err = error as { shortMessage?: string };
              console.error(err);
              toast.error(err.shortMessage || 'Transaction failed', { id: 'gig-action' });
            }
          }}
        />
      )}

      {showCreateModal && (
        <CreateGig
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            console.log('Contract PostGig Calling...');
            // handle refresh or success notice
          }}
        />
      )}
    </>
  );
}
