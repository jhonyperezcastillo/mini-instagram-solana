"use client";

import { useEffect, useState } from "react";
import { fetchPosts, PostWithPubkey } from "@/utils/post"; // ✅ Importamos correctamente
import { useWallet } from "@solana/wallet-adapter-react";

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
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (wallet) {
      getPosts();
    }
  }, [wallet]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Mini Instagram</h1>
      {!wallet && (
        <p className="text-red-500 mb-4">Please connect your wallet to see posts</p>
      )}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              <p className="text-base">{post.content}</p>
              <p className="text-xs text-gray-500 mt-1">Author: {post.author}</p>
            </div>
          ))
        ) : (
          <p>No posts found. Be the first to create a post!</p>
        )}
      </div>
    </div>
  );
}
