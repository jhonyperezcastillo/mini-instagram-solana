"use client";

import { useEffect, useState } from "react";
import { fetchPosts } from "@/utils/post";
import { useWallet } from "@solana/wallet-adapter-react";
import PostForm from "@/app/components/PostForm";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface Post {
  content: string;
  author: string;
  pubkey: string;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { wallet } = useWallet();

  // 🔄 Cargar los posts al cargar la app y cuando cambia la wallet
  useEffect(() => {
    const getPosts = async () => {
      if (!wallet) return;

      try {
        setLoading(true);
        const fetched = await fetchPosts(wallet.adapter);
        setPosts(fetched);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [wallet]);

  return (
    <div className="container">
      <div className="header">
        <h1>📸 Mini Instagram SOL App</h1>
      </div>

      <WalletMultiButton className="wallet-button" />

      <div className="main-content">
        <h2>📢 Publicar Post</h2>
        <PostForm onPostPublished={async () => {
          // 🔁 Recargar los posts después de publicar
          if (wallet) {
            const fetched = await fetchPosts(wallet.adapter);
            setPosts(fetched);
          }
        }} />
      </div>

      {/* ✅ Mostrar los posts desde la blockchain */}
      {wallet && (
        <div className="posts-container">
          {loading ? (
            <div className="post">⏳ Cargando posts...</div>
          ) : posts.length > 0 ? (
            posts.map((post, idx) => (
              <div key={idx} className="post">
                <p>📝 {post.content}</p>
                <small>🧑 Autor: {post.author}</small>
              </div>
            ))
          ) : (
            <div className="post">
              🎉 No hay posts todavía. ¡Sé el primero en publicar algo!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
