"use client";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { ReactNode, useMemo } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
import "@/app/globals.css";

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Mini Instagram - Solana dApp</title>
        <meta name="description" content="A decentralized Instagram-like app built on Solana" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0D1117] font-inter text-white">
        <WalletContextProvider>
          <main className="min-h-screen flex flex-col items-center justify-center p-6">{children}</main>
        </WalletContextProvider>
      </body>
    </html>
  );
}