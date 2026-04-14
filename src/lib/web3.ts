import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { celo, celoAlfajores } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo_project_id';

export const wagmiConfig = createConfig({
    chains: [celo, celoAlfajores],
    connectors: [
        injected(),
        walletConnect({ projectId }),
        coinbaseWallet({ appName: 'MiniGigs' }),
    ],
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    transports: {
        [celo.id]: http(),
        [celoAlfajores.id]: http(),
    },
});
