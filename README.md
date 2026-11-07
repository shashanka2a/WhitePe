# WhitePe

**Pay with crypto. Scan any UPI QR. Settle in USDT on Whitechain.**

WhitePe is a crypto payment gateway that lets customers pay at any UPI merchant using crypto from multiple chains while merchants receive stablecoin (USDT) on [Whitechain](https://whitechain.io) with tamper-proof receipts on [Arkiv](https://arkiv.network). Cross-chain bridging and token swaps are aggregated via [LI.FI](https://li.fi).

---

## Why On-Chain Settlement on Whitechain?

Traditional payment rails (card networks, wire transfers, legacy payment aggregators) have fundamental flaws for modern commerce:

- **Settlement Speed**: Legacy rails take 24 to 72 hours for funds to clear. Whitechain provides sub-second transaction finality, meaning merchants receive their settled funds immediately.
- **Zero Volatility**: Settling directly in USDT ensures merchants receive exact 1:1 dollar value without currency fluctuation or conversion fees.
- **No Chargeback Fraud**: Card networks permit reversals up to 120 days post-transaction. On-chain transfers are irreversible, eliminating chargeback fraud entirely.
- **Cryptographic Receipts**: Every settlement generates an on-chain event. Arkiv indexes these events into cryptographic, tamper-evident receipts that merchants, customers, and auditors can verify independently without trusting an opaque centralized database.
- **Micro-Fees**: Whitechain transaction gas costs are fractions of a cent, avoiding the 1.5% to 3.5% processing fees charged by traditional card networks.

A centralized database can track numbers, but it cannot prove that a specific transfer occurred at a specific timestamp to a specific address without requiring all parties to trust the server operator. The blockchain acts as the settlement layer, and Arkiv acts as the verifiable receipt layer.

---

## Architecture

```
Customer (any chain: Ethereum, Base, Arbitrum, Polygon, etc.)
       │
       │  Pays with ETH, USDC, WBT, or any token
       ▼
┌─────────────────────┐
│  WhitePe Checkout   │  Next.js consumer UI (scan UPI QR)
│  (src/)             │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  LI.FI Cross-Chain Bridge and DEX Aggregator            │
│  * Finds optimal bridge and swap route across 30+ chains│
│  * Bridges assets cross-chain into Whitechain           │
│  * Swaps source assets into USDT on Whitechain          │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  Whitechain (Chain ID 1874 Testnet)                     │
│                                                         │
│  ┌─────────────────────────┐  ┌──────────────────────┐  │
│  │ WhitePeSettlement.sol   │  │ WhitePeInvoiceRegistry│  │
│  │ * Receives USDT         │  │ * Creates invoices    │  │
│  │ * Forwards to merchant  │  │ * Marks paid on settle│  │
│  │ * Emits PaymentSettled  │  │ * On-chain status     │  │
│  │ * Prevents duplicates   │  │ * Queryable by Arkiv  │  │
│  └─────────────────────────┘  └──────────────────────┘  │
│                                                         │
│  USDT ──────────────────────► Merchant Wallet            │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Arkiv              │  Indexes on-chain events into queryable,
│  (Web3 Database)    │  tamper-evident receipt records
└─────────────────────┘
```

### Cross-Chain Bridging via LI.FI

WhitePe integrates LI.FI as its cross-chain bridging and liquidity aggregation protocol:

1. **Multi-Chain Input**: Customers can pay from Ethereum, Base, Arbitrum, Polygon, Optimism, or any EVM chain supported by LI.FI.
2. **Aggregated Routing**: LI.FI evaluates liquidity pools, gas costs, and bridge fees across protocols (Across, Stargate, Symbiosis, etc.) to discover the optimal path.
3. **Single Transaction Flow**: The customer signs one transaction on their source chain. LI.FI executes the cross-chain bridge and swap, delivering USDT directly to the merchant on Whitechain.
4. **Final Settlement**: The Whitechain settlement contract validates the invoice, forwards USDT to the merchant wallet, and emits an event indexed by Arkiv.

### Arkiv Web3 Database Integration

WhitePe uses the official `@arkiv-network/sdk` and `viem` to record, query, and verify cryptographic receipts on Arkiv:

1. **Schema Definition (`whitepe.receipts`)**: Receipts are typed and indexed using Arkiv's native type constructors (`str`, `addr`, `dec`). Key attributes like `paymentId`, `merchantUpi`, and `archivProof` are indexed for sub-second retrieval.
2. **On-Chain Indexing**: The backend publishes settlement entities to the Arkiv Rabdi testnet (Chain ID 7794095) with a 365-day retention period.
3. **Verification API & UI**:
   - `POST /api/arkiv/index`: Stores and indexes payment records.
   - `GET /api/arkiv/verify/[id]`: Cryptographically verifies receipts against the Arkiv network.
   - **Interactive Modal**: Both merchants and consumers can click any `arc_0x...` proof badge to inspect the verified on-chain entity, matching Whitechain tx hash, and Rabdi Explorer record.

---

## Smart Contract Overview

WhitePe keeps its smart contract footprint minimal:

| Contract | Location | Purpose |
|---|---|---|
| **WhitePeSettlement** | `contracts/src/WhitePeSettlement.sol` | Receives USDT from payer, forwards to merchant wallet, and emits `PaymentSettled` events while preventing duplicate settlements. |
| **WhitePeInvoiceRegistry** | `contracts/src/WhitePeInvoiceRegistry.sol` | Records invoices on-chain with expiry, status, and payer information for public auditability. |
| **IERC20** | `contracts/src/IERC20.sol` | Minimal standalone ERC-20 interface without external dependencies. |

---

## Smart Contract Deployment Guide

Contracts are configured for **Whitechain Sepolia** (Chain ID `1874`).

### Network Details

| Parameter | Value |
|---|---|
| Network Name | Whitechain Sepolia |
| Chain ID | `1874` |
| RPC URL | `https://rpc.testnet.whitechain.io` |
| Explorer | `https://explorer.testnet.whitechain.io` |
| Blockscout API | `https://explorer.testnet.whitechain.io/api/` |
| Gas Currency | WBT |
| Testnet Faucet | `https://faucet.testnet.whitechain.io` |

### Step 1: Install Foundry

If you do not have Foundry installed:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Step 2: Set Up Deployer Wallet

Import your deployer private key into Foundry's encrypted keystore (do not paste raw keys into chat or commit them):

```bash
cast wallet import deployer --interactive
```

Verify your address:

```bash
cast wallet address --account deployer
```

### Step 3: Fund Your Account

Claim testnet WBT for deployment gas at [faucet.testnet.whitechain.io](https://faucet.testnet.whitechain.io). Each claim provides 0.5 WBT per rolling 24-hour window.

Confirm your balance on Whitechain Sepolia:

```bash
cast balance <YOUR_WALLET_ADDRESS> --rpc-url https://rpc.testnet.whitechain.io
```

### Step 4: Build and Test Contracts

Navigate to the `contracts/` directory:

```bash
cd contracts
forge build
forge test -vvv
```

### Step 5: Deploy to Whitechain Sepolia

Run the deployment script with your target USDT token address:

```bash
USDT_ADDRESS=0x<USDT_ADDRESS> forge script script/Deploy.s.sol:Deploy \
  --rpc-url https://rpc.testnet.whitechain.io \
  --account deployer \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url https://explorer.testnet.whitechain.io/api/
```

### Step 6: Verify on Blockscout Explorer

If automatic verification was skipped or failed during broadcast, verify manually:

```bash
# Verify WhitePeSettlement
forge verify-contract <SETTLEMENT_ADDRESS> src/WhitePeSettlement.sol:WhitePeSettlement \
  --verifier blockscout \
  --verifier-url https://explorer.testnet.whitechain.io/api/ \
  --chain 1874 \
  --constructor-args $(cast abi-encode "constructor(address)" <USDT_ADDRESS>)

# Verify WhitePeInvoiceRegistry
forge verify-contract <REGISTRY_ADDRESS> src/WhitePeInvoiceRegistry.sol:WhitePeInvoiceRegistry \
  --verifier blockscout \
  --verifier-url https://explorer.testnet.whitechain.io/api/ \
  --chain 1874
```

---

## Deployed Contracts (Whitechain Sepolia)

| Contract | Target Network | Status |
|---|---|---|
| WhitePeSettlement | Whitechain Sepolia (Chain ID 1874) | Ready for deployment |
| WhitePeInvoiceRegistry | Whitechain Sepolia (Chain ID 1874) | Ready for deployment |

---

## Frontend Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20.9 or later)
- [pnpm](https://pnpm.io/) (version 9 or later)

### Running Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

- Landing Page: `http://localhost:3000`
- Consumer Checkout: `http://localhost:3000/app`
- Merchant Portal: `http://localhost:3000/merchant`

---

## Project Structure

```
WhitePe/
├── contracts/                    # Foundry smart contracts
│   ├── script/
│   │   └── Deploy.s.sol          # Deployment script
│   ├── src/
│   │   ├── IERC20.sol            # ERC-20 interface
│   │   ├── WhitePeInvoiceRegistry.sol
│   │   └── WhitePeSettlement.sol
│   ├── test/
│   │   └── WhitePeSettlement.t.sol
│   └── foundry.toml              # Whitechain network and compiler settings
├── src/                          # Next.js frontend application
│   ├── app/                      # Next.js app router routes
│   │   ├── app/                  # Consumer checkout application
│   │   ├── merchant/             # Merchant administration portal
│   │   └── page.tsx              # Landing page
│   ├── components/               # UI and landing page components
│   └── features/                 # Merchant and user workflows
├── public/brands/                # Official Whitechain, Arkiv, and LI.FI brand assets
└── package.json
```

---

## Current Status and Limitations

- **Testnet Deployment**: All smart contracts and transactions currently target Whitechain Sepolia (Chain ID 1874).
- **Faucet Limits**: Testnet WBT for deployment gas is subject to faucet limits of 0.5 WBT per rolling 24-hour window.
- **Contract Verification**: Contracts are compiled with Solidity 0.8.28 and verifiable publicly on the Whitechain Blockscout explorer.

---

## License

MIT
