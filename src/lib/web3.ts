import { http } from 'wagmi';
import { celo } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const wagmiConfig = getDefaultConfig({
    appName: 'MiniGigs',
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo_project_id',
    chains: [celo],
    transports: {
        [celo.id]: http('https://forno.celo.org'),
    },
    ssr: true,
});
