# 🇳🇵 Superteam Nepal Bounty — Solana Loyalty dApp (Devnet)

A decentralized customer loyalty dApp built on **Solana Devnet**.  
Users connect their **Phantom wallet**, register an on-chain account (**PDA**), and claim loyalty points using a custom **Anchor smart contract**.

Built, compiled, and deployed on **Arch Linux (Wayland/River)** using a minimalist terminal workflow.

---

## 🔗 Project Information

- **Network:** Solana Devnet  
- **Program ID:** `ZypDW9o9TSFYf2qvYueqLkAydmqgcqEg1bJ2bGAKsmR`  
- **Explorer Link:** https://explorer.solana.com/address/ZypDW9o9TSFYf2qvYueqLkAydmqgcqEg1bJ2bGAKsmR?cluster=devnet  
- **Tech Stack:** Rust, Anchor Framework, Next.js (React), Tailwind CSS, Solana Wallet Adapter  

---

## 📁 Folder Structure

```bash
bounty_project/
├── my_bounty_web/                 # Frontend (Next.js + Tailwind + Wallet Adapter)
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   ├── public/
│   ├── node_modules/              # Installed dependencies (auto-generated)
│   ├── README.md
│   └── src/
│       ├── idl/                   # IDL copied from Anchor build output
│       └── app/                   # Next.js App Router
│           ├── favicon.ico
│           ├── globals.css
│           ├── layout.tsx
│           └── page.tsx           # Main UI page (wallet connect, register, claim)
│
└── my_solana_bounty/              # Backend (Solana Program / Anchor)
    ├── Anchor.toml
    ├── Cargo.toml
    ├── Cargo.lock
    ├── rust-toolchain.toml
    ├── tsconfig.json
    ├── package.json
    ├── yarn.lock
    ├── migrations/
    ├── tests/
    ├── test-ledger/
    ├── target/                    # Build output (IDL lives here after anchor build)
    ├── node_modules/              # JS deps for Anchor tooling/scripts
    ├── app/                       # (empty in your repo currently)
    └── programs/
        └── my_solana_bounty/
            ├── Cargo.toml
            └── src/
                └── lib.rs         # Smart contract logic (PDA + points)
```
--

## 🧠 How It Works (Web3 Logic)

Unlike traditional Web2 applications, Solana requires users to allocate storage space on-chain.

### 1️⃣ Wallet Connection
Users authenticate using their **Phantom Wallet**.

### 2️⃣ Registration (Creating the PDA)
- New users must click **Register**.
- This creates a **Program Derived Address (PDA)**.
- The PDA:
  - Is owned by the smart contract
  - Is tied deterministically to the user’s wallet
  - Acts as a secure on-chain storage bucket
- A small network fee is paid to initialize the account.

### 3️⃣ Claiming Points
- Once registered, users can claim **10 loyalty points per transaction**.
- The smart contract updates the PDA data on-chain.

---

## ✅ Prerequisites

Before running this project, install:

- Node.js & npm
- Rust & Cargo
- Solana CLI
- Anchor CLI
- Phantom Wallet (browser extension)

---

## 🛠️ Setup Guide

---

### 🔹 1. Configure Devnet

#### Set Solana CLI to Devnet
```bash
solana config set --url devnet
```

#### Airdrop Test SOL
```bash
solana airdrop 2
```

You may also airdrop SOL to your Phantom wallet using the Devnet faucet.

---

### 🔹 2. Backend (Smart Contract)

If you want to build and deploy the contract yourself:

```bash
cd my_solana_bounty
anchor build
anchor deploy
```

⚠ If you deploy your own program, update:
- `lib.rs`
- `Anchor.toml`
- Frontend Program ID configuration

---

### 🔹 3. Frontend (Web App)

Navigate to the frontend:

```bash
cd my_bounty_web
```

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Copy the compiled IDL file:

```bash
mkdir -p src/idl
cp ../my_solana_bounty/target/idl/my_solana_bounty.json src/idl/
```

Start development server:

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 🎮 How to Use the dApp

### Connect Wallet
Click **Select Wallet** → Choose **Phantom**

### Register
If you are a new user:
- Click **Register User**
- Approve the transaction in Phantom
- Your on-chain PDA account is created

### Claim Points
- Click **Claim 10 Points**
- Approve transaction
- Your loyalty balance increases by 10

---

## 🏗️ What This Project Demonstrates

- PDA-based user accounts
- On-chain state management
- Wallet-based authentication
- Devnet deployment workflow
- Full-stack Web3 integration (Anchor + Next.js)

---

## ❤️ Built For

Built with dedication for the **Superteam Nepal** ecosystem.
