import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useBalance } from 'wagmi';
import { MINI_GIGS_ABI, ERC20_ABI } from '@/lib/abi';
import { MINIGIGS_CONTRACT_ADDRESS, CUSD_ADDRESS } from '@/lib/constants';
import { Shield, Download, RefreshCcw, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    // Read contract owner
    const { data: contractOwner } = useReadContract({
        address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
        abi: MINI_GIGS_ABI,
        functionName: 'owner',
    });

    // Read contract's cUSD balance
    const { data: contractBalance, refetch: refetchBalance } = useBalance({
        address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
        token: CUSD_ADDRESS as `0x${string}`,
    });

    // Read platform fee
    const { data: feeBps } = useReadContract({
        address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
        abi: MINI_GIGS_ABI,
        functionName: 'platformFeeBps',
    });

    const isOwner = address && contractOwner && address.toLowerCase() === (contractOwner as string).toLowerCase();

    const handleWithdraw = async () => {
        if (!isOwner) {
            toast.error("Unauthorized: Only contract owner can withdraw fees");
            return;
        }

        if (!contractBalance || contractBalance.value === BigUint64Array.from([0n])[0]) {
            toast.error("No fees available for withdrawal");
            return;
        }

        try {
            setIsWithdrawing(true);
            toast.loading("Withdrawing fees from contract...", { id: 'withdraw' });
            
            await writeContractAsync({
                address: MINIGIGS_CONTRACT_ADDRESS as `0x${string}`,
                abi: MINI_GIGS_ABI,
                functionName: 'withdrawFees',
                args: [contractBalance.value],
                // @ts-ignore - feeCurrency is supported on Celo
                feeCurrency: CUSD_ADDRESS as `0x${string}`,
            });

            toast.success("Fees withdrawn successfully!", { id: 'withdraw' });
            refetchBalance();
        } catch (error: any) {
            console.error(error);
            toast.error(error.shortMessage || "Withdrawal failed", { id: 'withdraw' });
        } finally {
            setIsWithdrawing(false);
        }
    };

    if (!isConnected || !isOwner) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Shield className={styles.icon} size={20} />
                <h3 className={styles.title}>Admin Panel</h3>
            </div>

            <div className={styles.statsCard}>
                <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Contract Fees (cUSD)</span>
                    <span className={styles.statValue}>
                        {contractBalance ? Number(contractBalance.formatted).toFixed(4) : '0.0000'}
                    </span>
                    <span className={styles.statSub}>
                        <TrendingUp size={12} /> Fee Rate: {feeBps ? Number(feeBps) / 100 : '2'}%
                    </span>
                </div>
                
                <button 
                    className={styles.withdrawBtn} 
                    onClick={handleWithdraw}
                    disabled={isWithdrawing || !contractBalance || contractBalance.value === 0n}
                >
                    {isWithdrawing ? <RefreshCcw size={16} className="animate-spin" /> : <Download size={16} />}
                    Withdraw
                </button>
            </div>
            
            <p className={styles.footerText}>
                Fees are automatically collected from every completed gig and stored in the contract escrow.
            </p>
        </div>
    );
}
