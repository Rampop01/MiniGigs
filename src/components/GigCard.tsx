'use client';

import type { Gig } from '@/lib/constants';
import { getCategoryInfo, formatCUSD, timeAgo } from '@/lib/utils';
import { Clock, Shield, Globe } from 'lucide-react';
import styles from './GigCard.module.css';

interface GigCardProps {
    gig: Gig;
    onClick?: () => void;
}

function VerificationIcon({ method }: { method: string }) {
    if (method === 'worldid') return <Globe size={12} />;
    if (method === 'self') return <Shield size={12} />;
    return null;
}

export default function GigCard({ gig, onClick }: GigCardProps) {
    const cat = getCategoryInfo(gig.category);

    return (
        <article className={`card ${styles.card} anim-fade-up`} onClick={onClick}>
            <div className={styles.top}>
                <span className={styles.catEmoji}>{cat.emoji}</span>
                <div className={styles.meta}>
                    <span className={styles.catLabel}>{cat.label}</span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.time}>{timeAgo(gig.createdAt)}</span>
                </div>
                <span className={styles.bounty}>{formatCUSD(gig.bounty)}</span>
            </div>
            <h3 className={styles.title}>{gig.title}</h3>
            <p className={styles.desc}>{gig.description}</p>
            <div className={styles.tags}>
                <span className={`badge badge-surface`}>
                    <Clock size={12} /> {gig.timeEstimate}
                </span>
                {gig.verification !== 'none' && (
                    <span className={`badge badge-amber`}>
                        <VerificationIcon method={gig.verification} />
                        {gig.verification === 'worldid' ? 'World ID' : 'Self Protocol'}
                    </span>
                )}
                <span className={`badge badge-green`}>
                    {gig.status === 'open' ? 'Open' : gig.status}
                </span>
            </div>
        </article>
    );
}
