import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { wagmiConfig } from '@/lib/web3';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MiniGigs — Micro-tasks, Macro-impact on Celo',
  description:
    'A mobile-first micro-task marketplace on Celo. Complete gigs, earn cUSD, and build your on-chain reputation — all from MiniPay.',
  keywords: ['Celo', 'MiniPay', 'micro-tasks', 'cUSD', 'Web3', 'gig economy', 'Proof of Ship'],
  openGraph: {
    title: 'MiniGigs — Micro-tasks on Celo',
    description: 'Complete micro-tasks and earn cUSD instantly via MiniPay.',
    type: 'website',
  },
  other: {
    'talentapp:project_verification': '437df7736e73d864ff0e69dd8a8c358abfee7c87c67709b8637925b46f94eadfbb09022826ccf0624fa6510657b3c117080b6ed377c7b000c65cfef30f73a24d',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D0C12',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    wagmiConfig,
    (await headers()).get('cookie')
  );

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
