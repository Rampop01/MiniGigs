import React from 'react';
import { CheckCircle, Zap, Shield } from 'lucide-react';
import styles from './LiveActivity.module.css';

const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: 'complete',
    user: '0x12...34',
    task: 'Translate to Swahili',
    amount: '8 cUSD',
    time: '2m ago',
  },
  {
    id: 2,
    type: 'post',
    user: '0xab...cd',
    task: 'Market Survey',
    amount: '15 cUSD',
    time: '5m ago',
  },
  {
    id: 3,
    type: 'verify',
    user: '0x77...88',
    task: 'World ID Verified',
    amount: null,
    time: '8m ago',
  },
  {
    id: 4,
    type: 'complete',
    user: '0xfe...12',
    task: 'Bug Report',
    amount: '5 cUSD',
    time: '12m ago',
  },
  {
    id: 5,
    type: 'complete',
    user: '0x99...00',
    task: 'UX Audit',
    amount: '20 cUSD',
    time: '15m ago',
  },
];

export default function LiveActivity() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.liveIndicator}>
          <div className={styles.dot} />
          <span>Live Activity</span>
        </div>
      </div>
      <div className={styles.scrollArea}>
        <div className={styles.track}>
          {[...RECENT_ACTIVITIES, ...RECENT_ACTIVITIES].map((activity, index) => (
            <div key={`${activity.id}-${index}`} className={styles.activityCard}>
              <div className={styles.iconWrap}>
                {activity.type === 'complete' && <CheckCircle size={14} color="var(--primary)" />}
                {activity.type === 'post' && <Zap size={14} color="#FFD700" />}
                {activity.type === 'verify' && <Shield size={14} color="#00FFA3" />}
              </div>
              <div className={styles.content}>
                <span className={styles.user}>{activity.user}</span>
                <span className={styles.task}>{activity.task}</span>
              </div>
              {activity.amount && <div className={styles.amount}>{activity.amount}</div>}
              <span className={styles.time}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// EOF update 1781535793910

// EOF update 1781632402990

// EOF update 1781718721602

// EOF update 1781801921438
