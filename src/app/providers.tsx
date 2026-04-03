'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { wagmiConfig } from '@/lib/web3';
import { useState, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#6C63FF',
                        accentColorForeground: '#ffffff',
                        borderRadius: 'large',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                >
                    {children}
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            className: 'toast-custom',
                            duration: 3000,
                            style: {
                                background: '#221F30',
                                color: '#F0EFF4',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '14px',
                                fontSize: '14px',
                            },
                        }}
                    />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
