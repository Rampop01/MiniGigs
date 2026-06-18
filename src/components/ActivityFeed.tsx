'use client';

import React from 'react';
import { timeAgo } from '@/lib/utils';
import { useGigsEvents, GigEvent } from '@/hooks/useGigsEvents';
import { useAccount } from 'wagmi';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Text, Label } from './ui/Typography';
import { Activity, Clock, User, CheckCircle, PlusCircle, ArrowRight } from 'lucide-react';
import styles from './ActivityFeed.module.css';

export default function ActivityFeed() {
  const { address } = useAccount();
  const { events } = useGigsEvents(address);

  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (events.length === 0) return null;

  const getEventIcon = (type: GigEvent['type']) => {
    switch (type) {
      case 'posted':
        return <PlusCircle size={14} className={styles.iconPosted} />;
      case 'accepted':
        return <User size={14} className={styles.iconAccepted} />;
      case 'submitted':
        return <ArrowRight size={14} className={styles.iconSubmitted} />;
      case 'completed':
        return <CheckCircle size={14} className={styles.iconCompleted} />;
      default:
        return <Activity size={14} />;
    }
  };

  return (
    <Card className={styles.container} variant="glass">
      <div className={styles.header}>
        <Activity size={16} />
        <Label>Live Activity</Label>
      </div>
      <div className={styles.list}>
        {events.slice(0, 5).map((event, idx) => (
          <div key={`${event.gigId}-${idx}`} className={styles.eventItem}>
            <div className={styles.iconWrapper}>{getEventIcon(event.type)}</div>
            <div className={styles.eventContent}>
              <Text variant="small">
                Gig <strong>#{event.gigId.toString()}</strong> was {event.type}
              </Text>
              <div className={styles.eventMeta}>
                <Clock size={10} />
                <span className={styles.time}>{timeAgo(event.timestamp)}</span>
              </div>
            </div>
            <Badge variant={event.type === 'completed' ? 'success' : 'info'}>{event.type}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

// EOF update 1781535792665

// EOF update 1781632401793

// EOF update 1781718720454

// EOF update 1781801920257
