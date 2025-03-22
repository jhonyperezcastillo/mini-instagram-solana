import { getProgram } from "./solana";
import { WalletAdapter } from "@solana/wallet-adapter-base";
import { Program, Idl, web3 } from "@coral-xyz/anchor";

// Estructura del PostAccount
interface PostAccount {
  author: web3.PublicKey;
  content: string;
}

// Resultado al traer un post desde la blockchain
export interface PostWithPubkey {
  pubkey: string;
  author: string;
  content: string;
}

export const createPost = async (
  wallet: WalletAdapter,
  content: string
): Promise<void> => {
  const program = getProgram(wallet) as Program<Idl>;
  await program.methods.createPost(content).rpc();
};

export const fetchPosts = async (
  wallet: WalletAdapter
): Promise<PostWithPubkey[]> => {
  const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");
  const program = getProgram(wallet) as Program<Idl>;

  const postAccounts = await connection.getProgramAccounts(program.programId, {
    filters: [{ dataSize: 8 + 32 + 280 }]
  });

  return postAccounts.map(({ pubkey, account }) => {
    const decoded = program.coder.accounts.decode("PostAccount", account.data) as PostAccount;

    return {
      pubkey: pubkey.toBase58(),
      author: decoded.author.toBase58(),
      content: decoded.content
    };
  });
};
