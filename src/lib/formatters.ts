/**
 * Utility functions for formatting and display in MiniGigs.
 * Provides consistent formatting across the application for
 * addresses, currency, dates, and other display values.
 */

/**
 * Truncates an Ethereum address to a readable format.
 * @example truncateAddress("0x1234567890abcdef1234567890abcdef12345678") => "0x1234...5678"
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Formats a cUSD amount with proper decimal places and currency symbol.
 * @example formatCUSD(1.5) => "$1.50 cUSD"
 */
export function formatCUSD(amount: number | bigint, decimals = 2): string {
  const num = typeof amount === 'bigint' ? Number(amount) / 1e18 : amount;
  return `$${num.toFixed(decimals)} cUSD`;
}

/**
 * Formats a large number with K/M/B suffixes.
 * @example formatCompact(1500) => "1.5K"
 */
export function formatCompact(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Returns a relative time string from a timestamp.
 * @example timeAgo(Date.now() - 60000) => "1 min ago"
 */
export function timeAgo(timestamp: number | Date): string {
  const now = Date.now();
  const ts = timestamp instanceof Date ? timestamp.getTime() : timestamp;
  const diff = Math.floor((now - ts) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(ts).toLocaleDateString();
}

/**
 * Formats a deadline timestamp into a human-readable countdown.
 * @example formatDeadline(futureTimestamp) => "2d 5h left"
 */
export function formatDeadline(deadline: number | Date): string {
  const now = Date.now();
  const dl = deadline instanceof Date ? deadline.getTime() : deadline * 1000;
  const diff = Math.max(0, dl - now);

  if (diff === 0) return 'Expired';

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

/**
 * Returns the urgency level based on remaining time.
 */
export function getUrgencyLevel(deadline: number | Date): 'safe' | 'warning' | 'critical' {
  const now = Date.now();
  const dl = deadline instanceof Date ? deadline.getTime() : deadline * 1000;
  const diff = dl - now;

  if (diff <= 0) return 'critical';
  if (diff < 86400000) return 'critical'; // < 1 day
  if (diff < 259200000) return 'warning'; // < 3 days
  return 'safe';
}

/**
 * Generates a deterministic color from a string (for avatars).
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Generates initials from a wallet address or name.
 */
export function getInitials(input: string): string {
  if (input.startsWith('0x')) {
    return input.slice(2, 4).toUpperCase();
  }
  return input
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
