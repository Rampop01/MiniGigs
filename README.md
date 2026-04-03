# MiniGigs — Micro-tasks, Macro-impact on Celo

MiniGigs is a mobile-first micro-task marketplace built for the Celo ecosystem. It connects posters with global workers to complete lightning-fast tasks like translations, data collection, and surveys, rewarded instantly in **cUSD** stablecoins via **MiniPay**.

---

##  Vision
Despite the rise of the gig economy, global workers are often limited by high transaction fees and slow cross-border payments. MiniGigs leverages Celo's ultra-low fees and second-fast finality to enable a "pennies-for-minutes" economy that works anywhere in the world.

### Features
- **MiniPay Optimized**: Native mobile-first design with smooth wallet integration.
- **Instant Payouts**: Escrow-based smart contracts trigger instant settlement in stablecoins.
- **Identity Verification**: Integrated with **World ID** and **Self Protocol** to prevent sybil attacks.
- **On-Chain Reputation**: Build a verifiable work history and earn high-tier badges.

---

##  Technology Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Blockchain**: [Celo Mainnet](https://celo.org/)
- **Payments**: cUSD (Celo Dollar)
- **Web3 Tools**: [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/), [RainbowKit](https://www.rainbowkit.com/)
- **Security**: WorldID Verification / Self Protocol
- **Styling**: Vanilla CSS with a custom-engineered "Premium Dark" design system.

---

##  How it Works
1. **Explore**: Browse available micro-gigs categorized by task type and bounty.
2. **Accept**: Securely accept a gig and lock the escrow.
3. **Submit**: Complete the task and submit proof-of-work.
4. **Earn**: Get paid directly to your MiniPay wallet as soon as work is verified.

---

##  Smart Contract
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

##  Getting Started
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

---

##  Proof of Ship Status
- [x] Integrate MiniPay / Web3 Wallet
- [x] UI/UX optimized for mobile screens
- [x] cUSD stablecoin integration
- [x] Category-based task discovery
- [x] Identity verification hooks
- [ ] Production escrow contract deployment (Upcoming)


