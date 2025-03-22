"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { sendTransactionToSolana } from "@/utils/solana";

type PostFormProps = {
  onPostPublished?: () => void; // ✅ Nueva prop opcional para recargar posts
};

export default function PostForm({ onPostPublished }: PostFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [explorerLink, setExplorerLink] = useState<string | null>(null);
  const { connected, wallet } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !wallet) return;

    setIsSubmitting(true);
    setExplorerLink(null);

    try {
      const txUrl = await sendTransactionToSolana(wallet.adapter, content.trim());
      setContent("");
      setExplorerLink(txUrl);

      // ✅ Llamamos a la función si se proporcionó
      if (onPostPublished) {
        onPostPublished();
      }
    } catch (error) {
      console.error("Error publicando en Solana:", error);
      alert(error instanceof Error ? error.message : "Error al publicar el post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="post-content" className="block text-sm mb-1">
          📢 Contenido del post
        </label>
        <textarea
          id="post-content"
          className="form-control"
          placeholder="¿Qué estás pensando?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!connected || isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={!connected || isSubmitting || !content.trim()}
        className="btn-publish"
      >
        {isSubmitting ? "Publicando..." : "Publicar"}
      </button>

      {!connected && (
        <div className="message mt-4 text-yellow-300">
          ⚠️ Conéctate con tu wallet para publicar.
        </div>
      )}

      {explorerLink && (
        <div className="message mt-4 p-3 bg-green-100 text-green-800 rounded text-sm">
          <p className="mb-1 flex items-center">
            ✅ Post publicado correctamente.
          </p>
          <a
            href={explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 hover:text-blue-800"
          >
            Ver en Solana Explorer
          </a>
        </div>
      )}
    </form>
  );
}
