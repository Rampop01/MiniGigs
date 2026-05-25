import { Globe, Database, ClipboardCheck, TestTube, PenTool, Palette, Layers } from 'lucide-react';
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
  const category = GIG_CATEGORIES.find((c) => c.id === categoryId);

  let Icon = Layers;
  switch (categoryId) {
    case 'translation':
      Icon = Globe;
      break;
    case 'data':
      Icon = Database;
      break;
    case 'survey':
      Icon = ClipboardCheck;
      break;
    case 'testing':
      Icon = TestTube;
      break;
    case 'content':
      Icon = PenTool;
      break;
    case 'design':
      Icon = Palette;
      break;
    default:
      Icon = Layers;
  }

  return {
    id: categoryId,
    label: category?.label ?? categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
    Icon,
  };
}

/** Format cUSD amount */
export function formatCUSD(amount: number): string {
  if (typeof amount !== 'number') return '0 cUSD';
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${formatter.format(amount)} cUSD`;
}

/** Validate a bounty amount string — returns error message or null if valid */
export function validateBounty(value: string): string | null {
  const num = parseFloat(value);
  if (isNaN(num)) return 'Bounty must be a number';
  if (num <= 0) return 'Bounty must be greater than 0';
  if (num < 0.1) return 'Minimum bounty is 0.1 cUSD';
  if (num > 100_000) return 'Maximum bounty is 100,000 cUSD';
  return null; // valid
}

/** Format a Unix timestamp (seconds) as a localized date string */
export function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

