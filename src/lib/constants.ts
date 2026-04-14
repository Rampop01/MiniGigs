// ── Minigigs Constants ──

// Deployed MiniGigs contract address on Celo Mainnet
export const MINIGIGS_CONTRACT_ADDRESS = '0x2eADE8A2C7F2561136180451545F0a4d938Ba694' as const;
export const MINIGIGS_CONTRACT_ADDRESS_ALFAJORES = '0x...' as const; // Add your testnet address here

// cUSD Stablecoin 
export const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const; // Mainnet
export const CUSD_ADDRESS_ALFAJORES = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1' as const; // Alfajores

// Chain IDs
export const CELO_CHAIN_ID = 42220;
export const CELO_ALFAJORES_CHAIN_ID = 44787;

// Task / Gig categories
export const GIG_CATEGORIES = [
    { id: 'translation', label: 'Translation' },
    { id: 'data', label: 'Data Collection' },
    { id: 'survey', label: 'Survey' },
    { id: 'testing', label: 'Testing' },
    { id: 'content', label: 'Content' },
    { id: 'design', label: 'Design' },
    { id: 'other', label: 'Other' },
] as const;

// Time estimate options
export const TIME_ESTIMATES = [
    '5 min', '10 min', '15 min', '30 min', '1 hr', '2 hr', '4 hr',
] as const;

// Verification methods
export const VERIFICATION_METHODS = [
    { id: 'none', label: 'No verification' },
    { id: 'worldid', label: 'World ID' },
    { id: 'self', label: 'Self Protocol' },
] as const;

export type GigStatus = 'open' | 'in_progress' | 'submitted' | 'completed' | 'disputed' | 'cancelled';

export interface Gig {
    id: string;
    title: string;
    description: string;
    category: string;
    bounty: number;         // in cUSD
    timeEstimate: string;
    verification: string;
    status: GigStatus;
    poster: string;         // wallet address
    worker: string | null;
    createdAt: number;
    deliverables?: string;
}

// Mock gigs for demo
export const MOCK_GIGS: Gig[] = [
    {
        id: '1',
        title: 'Translate App UI — English to Swahili',
        description: 'Translate 40 UI strings for a mobile fintech app from English to Swahili. Must be a native speaker. Deliver as a JSON file.',
        category: 'translation',
        bounty: 8,
        timeEstimate: '30 min',
        verification: 'worldid',
        status: 'open',
        poster: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
        worker: null,
        createdAt: Date.now() - 3600000,
    },
    {
        id: '2',
        title: 'Photo Survey: Local Market Prices',
        description: 'Visit your nearest open-air market and photograph price tags for 10 staple goods (maize, rice, cooking oil, etc). GPS metadata required.',
        category: 'data',
        bounty: 15,
        timeEstimate: '1 hr',
        verification: 'worldid',
        status: 'open',
        poster: '0x1234567890ABCdef1234567890ABCdEf12345678',
        worker: null,
        createdAt: Date.now() - 7200000,
    },
    {
        id: '3',
        title: 'Test New MiniPay Feature',
        description: 'Follow a guided test script (15 steps) for a new send-money flow in a staging MiniPay build. Report any bugs found with screenshots.',
        category: 'testing',
        bounty: 5,
        timeEstimate: '15 min',
        verification: 'none',
        status: 'open',
        poster: '0xfEdcBA0987654321FEdcBA098765432100000000',
        worker: null,
        createdAt: Date.now() - 1800000,
    },
    {
        id: '4',
        title: 'Write a Product Review',
        description: 'Write a 200-word honest review of the Valora wallet experience. Must include at least one screenshot of your own usage.',
        category: 'content',
        bounty: 3,
        timeEstimate: '15 min',
        verification: 'self',
        status: 'open',
        poster: '0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD',
        worker: null,
        createdAt: Date.now() - 600000,
    },
    {
        id: '5',
        title: 'UX Audit — Onboarding Screens',
        description: 'Review the onboarding flow (5 screens) of a DeFi lending app. Provide 3 actionable improvements with annotated screenshots.',
        category: 'design',
        bounty: 20,
        timeEstimate: '2 hr',
        verification: 'worldid',
        status: 'open',
        poster: '0x9876543210AbCdEf9876543210AbCdEf98765432',
        worker: null,
        createdAt: Date.now() - 14400000,
    },
    {
        id: '6',
        title: 'Transcribe Voice Note (Yoruba)',
        description: 'Transcribe a 3-minute Yoruba voice recording into typed text. Basic punctuation required.',
        category: 'data',
        bounty: 4,
        timeEstimate: '10 min',
        verification: 'none',
        status: 'open',
        poster: '0x1111222233334444555566667777888899990000',
        worker: null,
        createdAt: Date.now() - 900000,
    },
];
