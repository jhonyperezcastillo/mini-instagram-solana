"use client";

import { useEffect, useState } from "react";
import { fetchPosts, PostWithPubkey } from "@/utils/post"; // ✅ Usamos la interfaz exportada
import { useWallet } from "@solana/wallet-adapter-react";
import PostForm from "@/app/components/PostForm";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Dashboard() {
  const [posts, setPosts] = useState<PostWithPubkey[]>([]);
  const { wallet } = useWallet();

  useEffect(() => {
    const getPosts = async () => {
      if (!wallet) {
        console.error("Wallet not connected");
        return;
      }

      try {
        const fetchedPosts = await fetchPosts(wallet.adapter);
        setPosts(fetchedPosts); // ✅ ya es tipo PostWithPubkey[]
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (wallet) {
      getPosts();
    }
  }, [wallet]);

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>📸 Mini Instagram SOL App</h1>
      </div>

      {/* Wallet Button */}
      <WalletMultiButton className="wallet-button" />

      {/* Main Content */}
      <div className="main-content">
        <h2>📢 Publicar Post</h2>

        {/* Post Form */}
        <PostForm />

        {/* Message when not connected */}
        {!wallet && (
          <div className="message">
            ⚠️ Por favor conecta tu wallet para ver y crear posts.
          </div>
        )}
      </div>

      {/* Posts container */}
      {wallet && (
        <div className="posts-container">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={index} className="post">
                <p>📝 {post.content}</p>
                <p className="text-xs text-gray-500 mt-1">Autor: {post.author}</p>
              </div>
            ))
          ) : (
            <div className="post">
              <p>🎉 No hay posts todavía. ¡Sé el primero en publicar algo!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
