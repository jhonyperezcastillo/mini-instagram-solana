import { AnchorProvider, Program, Wallet as AnchorWallet, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../idl.json";
import { WalletAdapter } from "@solana/wallet-adapter-base";

// ✅ Dirección del programa obtenida correctamente del IDL (sin usar `any`)
const programID: PublicKey = new PublicKey(
  (idl as Idl & { metadata?: { address?: string } }).metadata?.address ??
    "CSSiDf2hnmct2dCz9zb6ZjS4pnwQHXSP28dYJCL5QKjH"
);

// ✅ Conexión a la red de Solana (Devnet)
const getConnection = (): Connection => {
  return new Connection("https://api.devnet.solana.com", "confirmed");
};

// ✅ Provider usando Anchor y el adaptador de wallet
const getProvider = (wallet: WalletAdapter): AnchorProvider => {
  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const connection = getConnection();
  return new AnchorProvider(connection, wallet as unknown as AnchorWallet, {
    preflightCommitment: "confirmed",
  });
};

// ✅ Devuelve el programa ya inicializado con el IDL
const getProgram = (wallet: WalletAdapter): Program => {
  const provider = getProvider(wallet);
  return new Program(idl as Idl, provider); // No se necesita el programID aquí
};

// ✅ Envía la transacción para crear un post
export async function sendTransactionToSolana(
  wallet: WalletAdapter,
  content: string
): Promise<string> {
  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const program = getProgram(wallet);

  const [postPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), wallet.publicKey.toBuffer(), Buffer.from(content)],
    programID
  );

  try {
    const tx = await program.methods
      .createPost(content)
      .accounts({
        post: postPDA,
        author: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Transacción confirmada:", tx);
    return `https://explorer.solana.com/tx/${tx}?cluster=devnet`;
  } catch (error) {
    console.error("❌ Error al enviar transacción:", error);
    throw new Error("Error al publicar el post en la blockchain.");
  }
}

export { getConnection, getProvider, getProgram };
