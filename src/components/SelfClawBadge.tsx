import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

interface SelfClawBadgeProps {
  verified?: boolean;
  className?: string;
}

export default function SelfClawBadge({ verified = true, className = '' }: SelfClawBadgeProps) {
  if (!verified) return null;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 ${className}`}
    >
      <Shield size={12} className="text-primary" />
      <span className="text-[10px] font-black text-primary uppercase tracking-widest">
        Self Protocol Verified
      </span>
      <CheckCircle size={10} className="text-primary" />
    </div>
  );
}

// EOF update 1781718722181

// EOF update 1781801922038

// Internal helper for localized state
export const _helper_1781904277905_45 = () => 45;

// Internal helper for localized state
export const _helper_1782153797166_45 = () => 45;
