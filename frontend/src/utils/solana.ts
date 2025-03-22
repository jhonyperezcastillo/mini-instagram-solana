import { AnchorProvider, Program, Wallet as AnchorWallet, Idl } from "@coral-xyz/anchor";
import { 
  Connection, 
  PublicKey, 
  SystemProgram
} from "@solana/web3.js";
import idl from "../idl.json";
import { WalletAdapter } from "@solana/wallet-adapter-base";

// ✅ Dirección del programa obtenida correctamente del IDL
const programID: PublicKey = new PublicKey((idl as Idl & { metadata?: { address?: string } }).metadata?.address ?? "CSSiDf2hnmct2dCz9zb6ZjS4pnwQHXSP28dYJCL5QKjH");

// ✅ Conexión a la red de Solana (Devnet)
const getConnection = () => new Connection("https://api.devnet.solana.com", "confirmed");

// ✅ Función para obtener el provider
const getProvider = (wallet: WalletAdapter): AnchorProvider => {
  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const connection = getConnection();
  return new AnchorProvider(connection, wallet as unknown as AnchorWallet, {
    preflightCommitment: "confirmed",
  });
};

// ✅ Corrección: El programa en Anchor debe recibir solo el IDL y el provider
const getProgram = (wallet: WalletAdapter): Program => {
  const provider = getProvider(wallet);
  return new Program(idl as Idl, provider); // ❌ Eliminamos el `programID`
};

// ✅ Función para enviar un post a la blockchain
export async function sendTransactionToSolana(
  wallet: WalletAdapter,
  content: string
): Promise<string> {
  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const program = getProgram(wallet);

  // ✅ Generar la PDA correcta para almacenar el post
  const [postPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("post"), wallet.publicKey.toBuffer(), Buffer.from(content)],
    programID
  );

  try {
    // ✅ Llamar al método `createPost` en el programa de Anchor
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

export { getProvider, getProgram };

export async function fetchPosts(wallet: WalletAdapter): Promise<any[]> {
  const connection = getConnection();
  const program = getProgram(wallet);

  // Buscamos todas las cuentas que coincidan con el tipo `PostAccount`
  const postAccounts = await connection.getProgramAccounts(program.programId, {
    filters: [
      {
        dataSize: 8 + 32 + 280 // Discriminador + Pubkey + String estimado (ajústalo si cambia)
      }
    ]
  });

  // Decodificamos el contenido usando la IDL
  return postAccounts.map(({ pubkey, account }) => {
    const decoded = program.coder.accounts.decode("PostAccount", account.data);
    return {
      pubkey: pubkey.toBase58(),
      author: decoded.author.toBase58(),
      content: decoded.content,
    };
  });
}

