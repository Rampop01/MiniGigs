# MiniGigs — Micro-tasks, Macro-impact on Celo

MiniGigs is a mobile-first micro-task marketplace built for the Celo ecosystem. It connects posters with global workers to complete lightning-fast tasks like translations, data collection, and surveys, rewarded instantly in **cUSD** stablecoins via **MiniPay**.

---

## Vision

Despite the rise of the gig economy, global workers are often limited by high transaction fees and slow cross-border payments. MiniGigs leverages Celo's ultra-low fees and second-fast finality to enable a "pennies-for-minutes" economy that works anywhere in the world.

### Features

- **MiniPay Optimized**: Native mobile-first design with smooth wallet integration.
- **Instant Payouts**: Escrow-based smart contracts trigger instant settlement in stablecoins.
- **Identity Verification**: Integrated with **World ID** and **Self Protocol** to prevent sybil attacks.
- **On-Chain Reputation**: Build a verifiable work history and earn high-tier badges.

---

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Blockchain**: [Celo Mainnet](https://celo.org/)
- **Payments**: cUSD (Celo Dollar)
- **Web3 Tools**: [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/), [RainbowKit](https://www.rainbowkit.com/)
- **Security**: WorldID Verification / Self Protocol
- **Styling**: Vanilla CSS with a custom-engineered "Premium Dark" design system.
- **Design System**: Atomic component architecture with glassmorphism effects.

---

## Design Standards: Premium Mobile-First

MiniGigs follows a strict design philosophy to ensure it feels like a native application within the MiniPay environment:

- **Safe Area Awareness**: All layout components use `env(safe-area-inset-*)` to handle notches and navigation bars.
- **Glassmorphism**: High-blur backdrops (20px+) and 1px borders with subtle gradients for a modern, tactile feel.
- **Touch-First Interactivity**: All interactive elements (buttons, tabs) maintain a minimum 44px tap target and use haptic-style "pop" animations.
- **Perceived Performance**: Integrated Skeleton loaders and "Pull to Refresh" indicators ensure the UI stays responsive even on limited mobile networks.
- **Atomic Components**: Foundational UI elements (Button, Card, Badge, Modal) are isolated for maximum reuse and visual consistency.
- **Real-time Event Architecture**: Powered by Viem's `watchContractEvent`, the UI provides immediate feedback for on-chain actions (GigPosted, GigCompleted) without page refreshes.

---

## Technical Architecture: Real-time Indexing

MiniGigs employs a client-side real-time indexing strategy to ensure a "live" marketplace feel:

- **useGigsEvents**: A custom hook that subscribes to all `MiniGigs` contract events on-chain.
- **Activity Feed**: A dedicated component that aggregates global market activity (Acceptances, Submissions, Settlements) into a chronological stream.
- **User-Specific Filtering**: The indexing engine identifies and prioritizes events involving the connected user's address, triggering specialized toast notifications.
- **Live Indicators**: Gigs posted within a 5-minute window are automatically flagged with a pulsing "Live" indicator, driven by the real-time event stream.

---

## How it Works

1. **Explore**: Browse available micro-gigs categorized by task type and bounty.
2. **Accept**: Securely accept a gig and lock the escrow.
3. **Submit**: Complete the task and submit proof-of-work.
4. **Earn**: Get paid directly to your MiniPay wallet as soon as work is verified.

---

## Escrow Security & Dispute Resolution

MiniGigs ensures a safe marketplace through a multi-layered escrow protection system:

### 🔐 Escrow Protection

- **Instant Locking**: When a poster creates a gig, cUSD is immediately locked in the smart contract.
- **Worker Guarantee**: Funds are guaranteed for the worker once they accept the gig and the status moves to `InProgress`.

### ⚖️ Dispute Resolution

- **Raising a Dispute**: Either the Poster or the Worker can raise a formal dispute if work is unsatisfactory or if communication breaks down. This can be done via the "Raise Dispute" button in the Gig Detail view.
- **On-Chain Arbitration**: Disputed gigs are frozen until an administrator (or multi-sig) reviews the submitted evidence.
- **Resolution Outcomes**: Administrators can resolve disputes by distributing the escrowed funds proportionally (e.g., 50/50 refund, full refund to poster, or full payout to worker).

### ⏳ Automatic Expiration

- **Safety Deadlines**: Every gig has a predefined deadline.
- **Unaccepted Refund**: If a gig is not accepted by any worker before the deadline, the poster can trigger an `expireGig` transaction to reclaim their full escrow amount automatically.

## Performance & Gas Efficiency

MiniGigs is optimized for high-performance and low-cost operations on Celo:

### 🏎️ RPC Optimization

- **Multicall3 Integration**: We use Multicall3 to batch 20+ gig metadata requests into a single RPC call.
- **Client-Side Caching**: Initial loads utilize `localStorage` for instant UI rendering while syncing with the chain in the background.

### ⛽ Gas Benchmarks (Hardhat Local)

| Action        | Standard Gas | Optimized Gas      | Saving   |
| :------------ | :----------- | :----------------- | :------- |
| Post Gig      | 259,259      | N/A                | Baseline |
| Accept Gig    | 70,612       | N/A                | Baseline |
| Complete Gig  | 77,579       | **28,523** (Batch) | **~63%** |
| Fetch 20 Gigs | 20 RPC calls | 1 RPC call         | **95%**  |

---

## Smart Contract

The platform is powered by a robust escrow contract supporting cUSD payments.

- **Source**: `contracts/MiniGigs.sol`
- **ABI**: Found in `src/lib/abi.ts`

### Deployment

1. Add your private key to `.env`:
   ```bash
   PRIVATE_KEY=your_key
   ```
2. Deploy to Alfajores Testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network alfajores
   ```
3. Deploy to Celo Mainnet:
   ```bash
   npx hardhat run scripts/deploy.js --network celo
   ```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   ```bash
   # .env.local
   NEXT_PUBLIC_WC_PROJECT_ID=your_id
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Format and Lint:

   ```bash
   # Run project-wide formatting
   npm run format

   # Run linting checks
   npm run lint
   ```

---

## 🚦 Project Status: **Live Marketplace & Autonomous Economy**

- **Autonomous Market**: Active (100+ bots simulating real-world gig transactions)
- **Gig Volume**: 500+ micro-gigs posted and settled on Celo
- **Identity**: Integrated Self Protocol for verified agent identification
- **Mobile First**: Optimized for MiniPay with instant cUSD settlement

---

## 🤖 Market Autonomous Mode

The MiniGigs marketplace is powered by an autonomous fleet of 100 bots.

- **Commander**: `scripts/commander.js` (Simulates posters and workers)
- **Funder**: `scripts/funder.js` (Ensures fleet has sufficient CELO for gas)
- **Config**: `scripts/bot-fleet.json`

---

## Proof of Ship Status

- [x] Integrate MiniPay / Web3 Wallet
- [x] UI/UX optimized for mobile screens
- [x] cUSD stablecoin integration
- [x] Category-based task discovery
- [x] Identity verification hooks
- [x] **Verified Agent Hub (Self Protocol Integration)**
- [x] **Real-time Notification Engine (Activity Feed)**
- [x] **Floating Action Quick Access (Mobile FAB)**
- [ ] Production escrow contract deployment (Upcoming)


## Real-time Notification System

MiniGigs features a robust, real-time notification engine:
- **Event Listeners**: Directly hooks into Celo blockchain events via Wagmi/Viem.
- **Global Context**: Centralized NotificationProvider ensures state consistency across the App.
- **Responsive Drawer**: Optimized for mobile with glassmorphism and slide-in animations.
- **Unread Logic**: Intelligent unread count tracking based on user interaction.
