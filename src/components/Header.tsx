'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <div className={styles.logoMark}>
                    <span className={styles.logoIcon}>⚡</span>
                </div>
                <div>
                    <h1 className={styles.title}>MiniGigs</h1>
                    <p className={styles.tagline}>Micro-tasks on Celo</p>
                </div>
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
