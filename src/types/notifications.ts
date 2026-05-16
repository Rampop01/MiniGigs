export type NotificationType = 'posted' | 'accepted' | 'submitted' | 'completed' | 'cancelled' | 'disputed';

export interface Notification {
  id: string;
  type: NotificationType;
  gigId: bigint;
  timestamp: number;
  read: boolean;
  message?: string;
  data?: Record<string, unknown>;
}
