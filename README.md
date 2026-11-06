# WhitePe

**Pay with crypto. Scan any UPI QR. Settle in USDT on Whitechain.**

WhitePe is a crypto payment gateway that lets customers pay at any UPI merchant using crypto from multiple chains while merchants receive stablecoin (USDT) on [Whitechain](https://whitechain.io) with tamper-proof receipts on [Arkiv](https://arkiv.network).

---

## Why on-chain stablecoin settlement?

Traditional payment rails (UPI, card networks, SWIFT) lock merchants into 24–72 hour settlement windows, charge 1.5–3% processing fees, expose both sides to chargeback risk, and have no natively machine-readable audit trail.

WhitePe settles in **USDT on Whitechain** because:

| Problem with legacy rails | How on-chain stablecoin settlement solves it |
|---|---|
| **Settlement delay** — funds arrive T+1 to T+3 | USDT transfer on Whitechain confirms in < 1 second; merchant has final funds immediately |
| **FX & volatility risk** — cross-border payments lose value between capture and settlement | USDT is a dollar-pegged stablecoin; 1 USDT in = 1 USDT out, no conversion spread |
| **Chargebacks** — card networks allow 120-day reversals that cost the merchant | On-chain transfers are final; there is no chargeback mechanism in the protocol |
| **Opaque reconciliation** — merchants reconcile against bank statements days later | Every settlement emits an on-chain event with invoice ID, amount, payer, and timestamp; Arkiv indexes these into a queryable, tamper-evident receipt store |
| **No programmability** — traditional rails can't trigger downstream logic on settlement | A smart contract can enforce invoice validation, prevent duplicate payments, and emit structured events that integrations can consume in real time |
| **High fees on small cross-border transfers** — SWIFT costs \$15–\$45 per wire | Whitechain gas fees are fractions of a cent per transaction |

A backend database could track payments, but it can't _prove_ that a specific USDT transfer happened at a specific time to a specific address — and it can't do so in a way that the merchant, the customer, and a third-party auditor can independently verify without trusting WhitePe's server. The blockchain is the settlement layer; Arkiv is the receipt layer. Together they replace the trust model, not just the payment speed.

---

## Architecture

```
Customer (any chain)
       │
       │  Pays with ETH / USDC / WBT / any supported token
       ▼
┌─────────────────────┐
│  WhitePe Frontend   │  Next.js app — consumer checkout + merchant portal
│  (src/)             │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  WhitePe Backend    │  Routing engine — selects bridge + DEX path
│  (planned)          │  Monitors source-chain tx → triggers settlement
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Bridge / Solver    │  Existing infra (Whitechain bridge, cross-chain solvers)
│  (not ours)         │  Locks/burns source token → mints/releases on Whitechain
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  DEX Router         │  Existing Whitechain DEX
│  (not ours)         │  Swaps received asset → USDT
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  Whitechain (chain ID 1874 testnet)                     │
│                                                         │
│  ┌─────────────────────────┐  ┌──────────────────────┐  │
│  │ WhitePeSettlement.sol   │  │ WhitePeInvoiceRegistry│  │
│  │ • Receives USDT         │  │ • Creates invoices    │  │
│  │ • Forwards to merchant  │  │ • Marks paid on settle│  │
│  │ • Emits PaymentSettled  │  │ • On-chain status     │  │
│  │ • Prevents duplicates   │  │ • Queryable by Arkiv  │  │
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

### Smart contract design

The contracts are intentionally minimal. WhitePe's value is the routing engine, conversion, and merchant experience — not another bridge protocol.

| Contract | Build ourselves? | Purpose |
|---|---|---|
| Bridge contracts | No | Use existing Whitechain / third-party bridge infra |
| DEX swap contracts | No | Use existing DEX on Whitechain |
| **WhitePeSettlement** | **Yes** | Receives USDT, forwards to merchant, emits settlement events |
| **WhitePeInvoiceRegistry** | **Yes** | On-chain invoice tracking, duplicate prevention, audit trail |

See [`contracts/`](./contracts/) for source code, tests, and deploy scripts.

---

## Project structure

```
WhitePe/
├── src/                          # Next.js frontend
│   ├── app/                      # App router pages
│   │   ├── page.tsx              # Landing page
│   │   ├── app/page.tsx          # Consumer checkout UI
│   │   └── merchant/page.tsx     # Merchant dashboard UI
│   ├── components/
│   │   ├── landing/              # Landing page components
│   │   └── ui/                   # Shared UI (crypto icons, etc.)
│   ├── features/
│   │   ├── user/UserApp.tsx      # Consumer payment flow
│   │   └── merchant/MerchantApp.tsx  # Merchant portal
│   └── lib/                      # Utilities
├── contracts/                    # Foundry smart contracts
│   ├── src/
│   │   ├── WhitePeSettlement.sol       # Payment settlement
│   │   ├── WhitePeInvoiceRegistry.sol  # Invoice registry
│   │   └── IERC20.sol                  # Token interface
│   ├── test/                     # Forge tests
│   ├── script/                   # Deploy scripts
│   └── foundry.toml
├── public/brands/                # Official brand assets
└── package.json
```

---

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20.9
- [pnpm](https://pnpm.io/) ≥ 9
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for smart contracts)

### Frontend

```bash
# Clone the repo
git clone https://github.com/<your-username>/WhitePe.git
cd WhitePe

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, `/app` for the consumer checkout, and `/merchant` for the merchant portal.

### Smart contracts

```bash
cd contracts

# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Build contracts
forge build

# Run tests
forge test -vvv
```

### Deploy to Whitechain Sepolia

1. **Import your deployer key** (run in your terminal, not in an AI chat):
   ```bash
   cast wallet import deployer --interactive
   ```

2. **Get testnet WBT** from [faucet.testnet.whitechain.io](https://faucet.testnet.whitechain.io) (requires GitHub OAuth, 0.5 WBT per 24h).

3. **Deploy**:
   ```bash
   forge script script/Deploy.s.sol:DeployWhitePe \
     --rpc-url https://rpc.testnet.whitechain.io \
     --account deployer \
     --broadcast \
     --verify \
     --verifier blockscout \
     --verifier-url https://explorer.testnet.whitechain.io/api/
   ```

4. **Verify** (if `--verify` failed during deploy):
   ```bash
   forge verify-contract <CONTRACT_ADDRESS> src/WhitePeSettlement.sol:WhitePeSettlement \
     --verifier blockscout \
     --verifier-url https://explorer.testnet.whitechain.io/api/ \
     --chain 1874
   ```

### Environment variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL of the deployed frontend |

---

## Whitechain Sepolia network

| Property | Value |
|---|---|
| Network name | Whitechain Sepolia |
| Chain ID | `1874` |
| RPC | `https://rpc.testnet.whitechain.io` |
| WebSocket | `wss://rpc.testnet.whitechain.io/ws` |
| Explorer | [explorer.testnet.whitechain.io](https://explorer.testnet.whitechain.io) |
| Native token | WBT |
| Faucet | [faucet.testnet.whitechain.io](https://faucet.testnet.whitechain.io) |

Add to MetaMask in one click: [Chainlist → Whitechain Sepolia](https://chainlist.org/?search=Whitechain+Sepolia&testnets=true)

---

## Deployed contracts (Whitechain Sepolia)

> Contracts will be deployed and addresses updated here after testnet deployment.

| Contract | Address | Explorer |
|---|---|---|
| WhitePeSettlement | `TBD` | [View on explorer](#) |
| WhitePeInvoiceRegistry | `TBD` | [View on explorer](#) |

---

## Transaction flow

A customer pays USDC on Ethereum for a ₹149 coffee:

```
1. Customer approves USDC on Ethereum
2. Bridge/solver locks USDC, releases equivalent on Whitechain
3. DEX swaps received token → USDT on Whitechain
4. WhitePeSettlement.settle() receives USDT
   ├── Validates invoice hasn't been settled before
   ├── Transfers USDT to merchant wallet
   ├── Marks invoice as paid in WhitePeInvoiceRegistry
   └── Emits PaymentSettled event
5. Arkiv indexes the event → tamper-proof receipt
6. WhitePe backend confirms settlement to both parties
```

The exact route (which bridge, which DEX) is chosen by the backend routing engine based on liquidity, fees, and speed. The on-chain contracts only handle the final settlement step.

---

## Current limitations

> [!IMPORTANT]
> This is a hackathon prototype — not production software.

- **No live bridge integration** — the cross-chain routing engine is mocked; actual bridge calls are not yet wired
- **No real USDT** — testnet uses a mock ERC-20 token, not actual Tether
- **Backend not implemented** — settlement monitoring, route selection, and merchant APIs are planned but not built
- **Single-chain settlement only** — MVP settles on Whitechain Sepolia; multi-chain destination support is future work
- **No wallet connection** — the frontend demos the UX flow but does not connect to MetaMask or WalletConnect yet
- **Testnet only** — all contracts are on Whitechain Sepolia (chain ID 1874); do not use with real funds
- **Faucet limits** — testnet WBT is limited to 0.5 per 24h rolling window
- **No formal audit** — contracts are minimal but have not been audited

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, vanilla CSS |
| Smart contracts | Solidity 0.8.28, Foundry |
| Settlement chain | Whitechain (EVM L1/L2) |
| Receipt storage | Arkiv (Web3 Database) |
| Stablecoin | USDT on Whitechain |

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit with clear messages (`git commit -m "feat: add merchant registration"`)
4. Push and open a PR

---

## License

MIT

---

<p align="center">
  Built for the Whitechain ecosystem · Settled in USDT · Receipts on Arkiv
</p>

