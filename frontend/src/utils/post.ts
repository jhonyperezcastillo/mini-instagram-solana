import { getProgram } from "./solana";
import { WalletAdapter } from "@solana/wallet-adapter-base";
import { Program, Idl } from "@coral-xyz/anchor";

// Definimos una interfaz para nuestro IDL específico
interface PostAccountsNamespace {
  post: {
    all: () => Promise<any[]>;
  };
}

// Extendemos el tipo Program para incluir nuestras cuentas personalizadas
type PostProgram = Program<Idl> & {
  account: PostAccountsNamespace;
};

export const createPost = async (wallet: WalletAdapter, content: string) => {
  const program = await getProgram(wallet) as PostProgram;
  await program.methods.createPost(content).rpc();
};

export const fetchPosts = async (wallet: WalletAdapter) => {
  const program = await getProgram(wallet) as PostProgram;
  return await program.account.post.all();
};