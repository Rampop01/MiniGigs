'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav, { TabId } from '@/components/BottomNav';
import CategoryFilter from '@/components/CategoryFilter';
import StatsBanner from '@/components/StatsBanner';
import GigCard from '@/components/GigCard';
import GigDetail from '@/components/GigDetail';
import CreateGig from '@/components/CreateGig';
import { MOCK_GIGS, Gig, MINIGIGS_CONTRACT_ADDRESS, CUSD_ADDRESS } from '@/lib/constants';
import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi';
import { MINI_GIGS_ABI } from '@/lib/abi';
import { useGigs } from '@/hooks/useGigs';
import { Info, Plus, ChevronRight, Award, History, Settings, CheckCircle, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('explore');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { gigs: liveGigs, isLoading: isGigsLoading } = useGigs();

  // ── Tab: Explore (The Marketplace) ──
  const filteredGigs = useMemo(() => {
    // Combine live and mock data for demo, or just live
    const allGigs = [...liveGigs, ...MOCK_GIGS];
    if (selectedCategory === 'all') return allGigs;
    return allGigs.filter(g => g.category === selectedCategory);
  }, [selectedCategory, liveGigs]);

  const ExploreView = () => (
    <div className={`${styles.tabContent} anim-slide-up`}>
      <StatsBanner />

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Marketplace {isGigsLoading && <Loader2 className="animate-spin inline-block ml-2" size={16} />}</h2>
        <button className={styles.addBtn} onClick={() => setShowCreateModal(true)}>
          <Plus size={18} /> Post Gig
        </button>
      </div>

      <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />

      <div className={styles.gigGrid}>
        {filteredGigs.map(gig => (
          <GigCard key={gig.id} gig={gig} onClick={() => setSelectedGig(gig)} />
        ))}
      </div>
    </div>
  );

  // ── Tab: My Tasks (For Workers) ──
  const myTasks = useMemo(() => {
    if (!address) return [];
    return liveGigs.filter(g => g.worker?.toLowerCase() === address.toLowerCase() && g.status !== 'Completed' && g.status !== 'Cancelled');
  }, [liveGigs, address]);

  const MyTasksView = () => (
    <div className={`${styles.tabContent} anim-slide-up`}>
      <h2 className={styles.pageTitle}>My Tasks</h2>

      {myTasks.length > 0 ? (
        <div className={styles.gigGrid}>
          {myTasks.map(gig => (
            <GigCard key={gig.id} gig={gig} onClick={() => setSelectedGig(gig)} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>No active tasks</h3>
          <p>Complete your tasks to unlock new micro-gigs.</p>
          <button className="btn-primary" style={{ marginTop: 'var(--sp-4)' }} onClick={() => setActiveTab('explore')}>
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
            <button className="btn-primary" style={{ flex: 1 }}>Withdraw</button>
            <button className="btn-primary" style={{ flex: 1, background: 'var(--bg-surface-elevated)', border: '1px solid var(--primary)', color: 'var(--primary)' }}>Deposit</button>
          </div>
        </div>

        <div className={styles.listSection}>
          <h3 className={styles.listTitle}>Payout History</h3>
          <div className={styles.listItem}>
            <div className={styles.listIcon} style={{ background: 'var(--accent-green-bg)' }}>
              <CheckCircle size={16} color="var(--accent-green)" />
            </div>
            <div className={styles.listInfo}>
              <strong>Market Reward</strong>
              <span>Swahili Localization · 3h ago</span>
            </div>
            <div className={styles.listAmount} style={{ color: 'var(--accent-green)' }}>+8.00</div>
          </div>
        </div>
      </div>
    );
  };

  // ── Tab: Profile (Reputation) ──
  const ProfileView = () => (
    <div className={`${styles.tabContent} anim-slide-up`}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          {address ? address.slice(2, 4).toUpperCase() : 'MG'}
        </div>
        <h2 className={styles.profileName}>
          {isConnected ? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected') : 'Guest User'}
        </h2>
        <span className={styles.reputationBadge}>
          <Award size={14} /> MiniGigs Pro Worker
        </span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statVal}>24</span>
          <span className={styles.statLab}>Finished</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statVal}>$312</span>
          <span className={styles.statLab}>Earned</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statVal}>100%</span>
          <span className={styles.statLab}>Trust</span>
        </div>
      </div>

      <div className={styles.menuList}>
        <div className={styles.menuItem}>
          <div className={styles.menuIcon}><Settings size={18} /></div>
          <span>Platform Settings</span>
          <ChevronRight size={16} />
        </div>
        <div className={styles.menuItem}>
          <div className={styles.menuIcon}><Info size={18} /></div>
          <span>Support Center</span>
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="layout-mobile">
      <div className={styles.container}>
        <Header />

        <main className={styles.main}>
          {activeTab === 'explore' && <ExploreView />}
          {activeTab === 'my-tasks' && <MyTasksView />}
          {activeTab === 'wallet' && <WalletView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>

        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>

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
              if (gig.status === 'Open') {
                toast.loading('Accepting gig...', { id: 'gig-action' });
                await writeContractAsync({
                  address: MINIGIGS_CONTRACT_ADDRESS,
                  abi: MINI_GIGS_ABI,
                  functionName: 'acceptGig',
                  args: [BigInt(gig.id)],
                });
                toast.success('Gig accepted! Go to My Tasks.', { id: 'gig-action' });
              } else if (gig.status === 'InProgress' && gig.worker?.toLowerCase() === address.toLowerCase()) {
                toast.loading('Submitting work...', { id: 'gig-action' });
                await writeContractAsync({
                  address: MINIGIGS_CONTRACT_ADDRESS,
                  abi: MINI_GIGS_ABI,
                  functionName: 'submitWork',
                  args: [BigInt(gig.id), "Proof of work: Job completed successfully."],
                });
                toast.success('Work submitted for review!', { id: 'gig-action' });
              } else if (gig.status === 'Submitted' && gig.poster?.toLowerCase() === address.toLowerCase()) {
                toast.loading('Releasing funds...', { id: 'gig-action' });
                await writeContractAsync({
                  address: MINIGIGS_CONTRACT_ADDRESS,
                  abi: MINI_GIGS_ABI,
                  functionName: 'completeGig',
                  args: [BigInt(gig.id)],
                });
                toast.success('Funds released to worker!', { id: 'gig-action' });
              }
              setSelectedGig(null);
            } catch (error: any) {
              console.error(error);
              toast.error(error.shortMessage || 'Transaction failed', { id: 'gig-action' });
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
    </div>
  );
}
