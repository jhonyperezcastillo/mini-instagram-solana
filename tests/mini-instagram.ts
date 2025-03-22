import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MiniInstagram } from "../target/types/mini_instagram";

describe("mini-instagram", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.MiniInstagram as Program<MiniInstagram>;

  it("Se inicializa correctamente!", async () => {
    const tx = await program.methods.initialize().rpc();
    console.log("Transacción de inicialización:", tx);
  });
});
