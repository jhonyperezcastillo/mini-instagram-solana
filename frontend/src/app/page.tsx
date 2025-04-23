"use client";

import { useEffect, useState } from "react";
import { fetchPosts, PostWithPubkey } from "@/utils/post"; // ✅ We use the exported interface
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
        setPosts(fetchedPosts); // ✅ already typed as PostWithPubkey[]
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
        <h2>📢 Publish Post</h2>

        {/* Post Form */}
        <PostForm />

        {/* Message when not connected */}
        {!wallet && (
          <div className="message">
            ⚠️ Please connect your wallet to view and create posts.
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
                <p className="text-xs text-gray-500 mt-1">Author: {post.author}</p>
              </div>
            ))
          ) : (
            <div className="post">
              <p>🎉 No posts yet. Be the first to publish something!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
