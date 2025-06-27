"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBlogPosts } from "../context/BlogPostContext";
import { useRoles } from "../context/RoleContext";
import BlogPostList from "../components/blogPost/BlogPostList";
import CreatePostModal from "../components/blogPost/CreatePostModal";

// 1. Context hooks
export default function BlogPage() {
  const { posts, fetchPosts, loading, error } = useBlogPosts();
  const { role } = useRoles();

  // 2. State hooks
  const [modalOpen, setModalOpen] = useState(false);

  // 3. Effects
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4. Functions
  const canCreatePost =
  Array.isArray(role) && (role.includes("Admin") || role.includes("Coach"));

  // 5. Render
  return (
    <main className="flex flex-col flex-1 items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-gray-900">
          TKD Hub Blog
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 text-center">
          Welcome to the TKD Hub Blog! Here you&apos;ll find news, tips, and stories from the world of Taekwondo and martial arts management.
        </p>
        {canCreatePost && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow transition"
            >
              Create Post
            </button>
          </div>
        )}
        {loading && (
          <div className="text-center text-blue-600 mb-4">Loading posts...</div>
        )}
        {error && (
          <div className="text-center text-red-600 mb-4">{error}</div>
        )}
        <BlogPostList posts={posts} />
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white font-semibold shadow transition text-center"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto px-6 py-2 rounded bg-green-700 hover:bg-green-800 text-white font-semibold shadow transition text-center"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition text-center"
          >
            Contact Us
          </Link>
        </div>
      </div>
      <CreatePostModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
