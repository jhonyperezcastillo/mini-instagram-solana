"use client";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/utils/post";
import { useWallet } from "@solana/wallet-adapter-react";

// Definimos una interfaz para la estructura del post
interface Post {
  account: {
    content: string;
    // Añade aquí otros campos que pueda tener tu post
  };
  // Puede que necesites más propiedades como publicKey, etc.
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { wallet } = useWallet();

  useEffect(() => {
    const getPosts = async () => {
      if (!wallet) {
        console.error("Wallet not connected");
        return;
      }
      
      try {
        const fetchedPosts = await fetchPosts(wallet.adapter);
        setPosts(fetchedPosts as Post[]);
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
              <p>{post.account.content}</p>
            </div>
          ))
        ) : (
          <p>No posts found. Be the first to create a post!</p>
        )}
      </div>
    </div>
  );
}