# TarotZama — FHEVM Tarot Oracle + AI Interpretation

TarotZama is a tarot oracle dApp built on **Zama FHEVM**:

- **Cards are drawn on-chain in encrypted form** (the chain never sees your clear draw).
- **Your wallet decrypts locally** via the Relayer SDK (only you can see the clear card IDs).
- **Upright / reversed** is generated client-side (stable per reading) to avoid biased randomness in some chain environments.
- **OpenAI-powered interpretation**: your question + the drawn cards are sent to a Next.js server route, and the analysis is shown under the spread.

## Repository layout

```text
tarotzama/
├── packages/
│   ├── hardhat/   # Tarot.sol + deploy scripts (localhost / sepolia)
│   └── nextjs/    # Next.js App Router frontend + FHEVM hooks + AI route
├── scripts/       # ABI/codegen helpers (used by root scripts)
└── README.md
```

## Prerequisites

- Node.js **20+**
- `pnpm` (via Corepack or installed manually)
- A browser wallet (MetaMask / RainbowKit-compatible)

## Quick start (frontend)

Install dependencies at repo root:

```bash
pnpm install
```

Create `packages/nextjs/.env.local`:

```bash
OPENAI_API_KEY=your_openai_key
```

Then run:

```bash
pnpm start
```

This starts the Next.js app (default `http://localhost:3000`).

### Optional frontend env vars

All optional (the app can still run without them in development, but RPC stability is better with your own keys):

- `NEXT_PUBLIC_ALCHEMY_API_KEY`: improves RPC reliability and avoids browser CORS issues with some public RPCs.
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project id (a default is provided in code).
- `NEXT_PUBLIC_CHAIN_ID`: set to `11155111` (Sepolia) or `31337` (local hardhat).

## Deploy the Tarot contract

### Sepolia

Create `packages/hardhat/.env`:

```bash
MNEMONIC="your twelve words ..."
INFURA_API_KEY="your_infura_key"
```

Deploy and generate frontend contract typings:

```bash
pnpm deploy:sepolia
```

This runs:
- `packages/hardhat` deployment to Sepolia
- `pnpm generate` which regenerates TypeScript ABIs and updates `packages/nextjs/contracts/deployedContracts.ts`

### Local hardhat

Create `packages/hardhat/.env` (required because the hardhat config reads `MNEMONIC`):

```bash
MNEMONIC="test test test test test test test test test test test junk"
INFURA_API_KEY="unused_for_local_but_required_by_config"
```

Run a local node + deploy + generate:

```bash
pnpm chain
pnpm deploy:localhost
```

Then set in `packages/nextjs/.env.local`:

```bash
NEXT_PUBLIC_CHAIN_ID=31337
```

And start the frontend:

```bash
pnpm start
```

## AI interpretation flow

- Users type a question in the input field.
- Tapping the crystal ball both **submits the question (local display)** and **requests the on-chain encrypted draw**.
- After the user clicks **Decrypt**, the UI calls:
  - `POST /api/tarot/analyze` (server-side)
  - The OpenAI response is rendered under the spread.

> Note: `OPENAI_API_KEY` is **server-only** and must be placed in `packages/nextjs/.env.local` and the dev server must be restarted after edits.

## Card images (WebP)

Optimized card images live in:

- `packages/nextjs/public/cardpic_webp/`

If you want to regenerate them from PNG sources:

```bash
pnpm --filter ./packages/nextjs images:webp -- --input ./utils/cardpic --publicOut ./public/cardpic_webp --quality 60 --maxWidth 900
```

## Troubleshooting

- **Stuck on “interpreting…”**: usually means the server cannot reach OpenAI from your network. The API route times out and will surface an error. Check your network/proxy and restart `pnpm start` after setting `OPENAI_API_KEY`.
- **RPC “Failed to fetch” in browser**: some public RPCs don’t allow browser CORS. Set `NEXT_PUBLIC_ALCHEMY_API_KEY` (recommended) or configure a CORS-friendly RPC in `packages/nextjs/scaffold.config.ts`.
- **Deploy succeeded but frontend still points to old contract**: run `pnpm generate` (already included in `pnpm deploy:sepolia` / `pnpm deploy:localhost`).

## License

BSD-3-Clause-Clear. See [LICENSE](LICENSE).
