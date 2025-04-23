"use client";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { sendTransactionToSolana } from "@/utils/solana";

type PostFormProps = {
  onPostPublished?: () => void; // ✅ Optional prop to refresh posts
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

      // ✅ Call the callback if provided
      if (onPostPublished) {
        onPostPublished();
      }
    } catch (error) {
      console.error("Error publishing to Solana:", error);
      alert(error instanceof Error ? error.message : "Error publishing the post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="post-content" className="block text-sm mb-1">
          📢 Post content
        </label>
        <textarea
          id="post-content"
          className="form-control"
          placeholder="What's on your mind?"
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
        {isSubmitting ? "Publishing..." : "Publish"}
      </button>

      {!connected && (
        <div className="message mt-4 text-yellow-300">
          ⚠️ Please connect your wallet to publish.
        </div>
      )}

      {explorerLink && (
        <div className="message mt-4 p-3 bg-green-100 text-green-800 rounded text-sm">
          <p className="mb-1 flex items-center">
            ✅ Post published successfully.
          </p>
          <a
            href={explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 hover:text-blue-800"
          >
            View on Solana Explorer
          </a>
        </div>
      )}
    </form>
  );
}
