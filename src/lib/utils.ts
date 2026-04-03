/** Shorten an Ethereum-style address for display */
export function shortenAddress(addr: string, chars = 4): string {
    if (!addr) return '';
    return `${addr.slice(0, chars + 2)}…${addr.slice(-chars)}`;
}

/** Time-ago helper */
export function timeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

/** Get the category emoji + label from a category id */
import { GIG_CATEGORIES } from './constants';

export function getCategoryInfo(categoryId: string) {
    return GIG_CATEGORIES.find(c => c.id === categoryId) ?? { id: categoryId, label: categoryId, emoji: '💡' };
}

/** Format cUSD amount */
export function formatCUSD(amount: number): string {
    return `${amount.toFixed(amount % 1 === 0 ? 0 : 2)} cUSD`;
}
