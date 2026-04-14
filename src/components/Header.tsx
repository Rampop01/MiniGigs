'use client';

import { useState, useEffect } from 'react';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import styles from './Header.module.css';

export default function Header() {
    const [isMiniPay, setIsMiniPay] = useState(false);
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();

    useEffect(() => {
        // @ts-ignore - MiniPay specific property
        if (typeof window !== 'undefined' && window.ethereum?.isMiniPay) {
            setIsMiniPay(true);
            // Auto-trigger connect modal if in MiniPay and not connected
            if (!isConnected && openConnectModal) {
                openConnectModal();
            }
        }
    }, [isConnected, openConnectModal]);

    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <div className={styles.crazyLogo}>
                    <span className={styles.logoM}>M</span>
                    <span className={styles.logoText}>iniGigs</span>
                </div>
                {!isMiniPay && <p className={styles.tagline}>Micro-tasks on Celo</p>}
                {isMiniPay && <p className={styles.tagline}>MiniPay Active</p>}
            </div>
            <ConnectButton.Custom>
                {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
                    const connected = mounted && account && chain;
                    return (
                        <button
                            className={connected ? styles.walletConnected : styles.walletBtn}
                            onClick={connected ? openAccountModal : openConnectModal}
                            type="button"
                        >
                            {connected ? (
                                <>
                                    <span className={styles.walletDot} />
                                    {account.displayName}
                                </>
                            ) : (
                                'Connect'
                            )}
                        </button>
                    );
                }}
            </ConnectButton.Custom>
        </header>
    );
}
