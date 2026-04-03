import {
    Globe,
    Database,
    ClipboardCheck,
    TestTube,
    PenTool,
    Palette,
    Layers,
    ShieldCheck,
    Zap,
    Lock
} from 'lucide-react';
import { GIG_CATEGORIES } from './constants';

/** Shorten an Ethereum-style address for display */
export function shortenAddress(addr: string, chars = 4): string {
    if (!addr) return '';
    if (addr.length < chars * 2 + 2) return addr;
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

/** Get the category label and icon component from a category id */
export function getCategoryInfo(categoryId: string) {
    const category = GIG_CATEGORIES.find(c => c.id === categoryId);

    let Icon = Layers;
    switch (categoryId) {
        case 'translation': Icon = Globe; break;
        case 'data': Icon = Database; break;
        case 'survey': Icon = ClipboardCheck; break;
        case 'testing': Icon = TestTube; break;
        case 'content': Icon = PenTool; break;
        case 'design': Icon = Palette; break;
        default: Icon = Layers;
    }

    return {
        id: categoryId,
        label: category?.label ?? categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
        Icon
    };
}

/** Format cUSD amount */
export function formatCUSD(amount: number): string {
    if (typeof amount !== 'number') return '0 cUSD';
    return `${amount.toFixed(amount % 1 === 0 ? 0 : 2)} cUSD`;
}
