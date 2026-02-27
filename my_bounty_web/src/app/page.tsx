"use client";
// import React, { useMemo, useState } from 'react';
import React, { useMemo, useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { useAnchorWallet, ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { MapPin, Trophy, UserPlus } from 'lucide-react';
import { AnchorProvider, Program, Idl, BN } from '@coral-xyz/anchor';

// 1. IMPORTANT: Import your IDL file
import idl from '../idl/my_solana_bounty.json';
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const PROGRAM_ID = new PublicKey("ZypDW9o9TSFYf2qvYueqLkAydmqgcqEg1bJ2bGAKsmR");

function Dashboard() {
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);

  // NEW: State variables to track what the UI should show
  const [isRegistered, setIsRegistered] = useState(false);
  const [points, setPoints] = useState(0);

  // NEW: This effect runs automatically whenever the wallet connects or changes
  useEffect(() => {
    const checkUserData = async () => {
      if (!wallet) return;

      try {
        // 1. Set up the connection
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" });
        const program = new Program(idl as any, provider) as any;

        // 2. Find the user's specific "Bucket" address (PDA)
        const [userStatsPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("user-stats"), wallet.publicKey.toBuffer()],
          program.programId
        );

        // 3. Try to read the bucket!
        const accountData = await program.account.userStats.fetch(userStatsPDA);

        // 4. If line 3 works, they are registered!
        setIsRegistered(true);
        setPoints(accountData.points.toNumber()); // Convert Solana big number to normal number

      } catch (err) {
        // If line 3 fails (throws an error), the bucket doesn't exist yet.
        console.log("User not registered yet.");
        setIsRegistered(false);
      }
    };

    checkUserData();
  }, [wallet]); // <--- This tells React to run this function every time the 'wallet' connects

  // The button logic (Same as before, but updates state after success)
  const handleAction = async (action: 'initialize' | 'add') => {
    if (!wallet) return alert("Connect Wallet first!");
    setLoading(true);

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" });
      const program = new Program(idl as any, provider) as any;

      const [userStatsPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-stats"), wallet.publicKey.toBuffer()],
        program.programId
      );

      if (action === 'initialize') {
        await program.methods.initializeUser().accounts({ userStats: userStatsPDA, signer: wallet.publicKey }).rpc();
        alert("Success! You are now registered.");
        setIsRegistered(true); // Update UI to hide register button
        setPoints(0); // Start points at 0
      } else {
        await program.methods.addPoints(new BN(10)).accounts({ userStats: userStatsPDA, signer: wallet.publicKey }).rpc();
        alert("Success! 10 Points added to the blockchain.");
        setPoints(points + 10); // Visually update the points on screen
      }
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-2 mb-6 text-red-500">
          <MapPin size={20} />
          <span className="font-bold tracking-widest uppercase text-sm">Nepal Devnet Bounty</span>
        </div>

        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
          Solana Loyalty
        </h1>

        <div className="flex justify-center mb-8">
          <WalletMultiButtonDynamic className="!bg-white !text-black !rounded-full !font-bold hover:!opacity-90 transition-all" />
        </div>

        {wallet ? (
          <div className="space-y-4">

            {/* SMART UI LOGIC STARTS HERE */}
            {!isRegistered ? (
              // Show this IF the user is NOT registered
              <button
                onClick={() => handleAction('initialize')}
                disabled={loading}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-zinc-700"
              >
                <UserPlus size={18} />
                {loading ? "Processing..." : "Register User"}
              </button>
            ) : (
              // Show this IF the user IS registered
              <>
                <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex justify-between items-center">
                  <span className="text-zinc-400 font-bold uppercase text-xs">Total Points</span>
                  <span className="text-2xl font-mono text-green-400">{points}</span>
                </div>

                <button
                  onClick={() => handleAction('add')}
                  disabled={loading}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Trophy size={18} />
                  {loading ? "Processing..." : "Claim 10 Points"}
                </button>
              </>
            )}
            {/* SMART UI LOGIC ENDS HERE */}

          </div>
        ) : (
          <p className="text-center text-zinc-600 text-sm italic">Waiting for wallet connection...</p>
        )}
      </div>
    </main>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false); // New state to wait for extension

  useEffect(() => {
    setMounted(true);
    // Give the extension 1 second to inject itself into the window
    const timer = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  // Don't render anything until the extension has had time to inject
  if (!mounted || !ready) return <div className="min-h-screen bg-black" />;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Dashboard />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}