"use client";
import { useBlogPosts } from "@/app/context/BlogPostContext";
import { useRoles } from "@/app/context/RoleContext";
import { useEffect, useState } from "react";
import BlogPostList from "./BlogPostList";
import dynamic from "next/dynamic";
import BlogHeader from "./BlogHeader";
import CreatePostButton from "./CreatePostButton";
import PageLinks from "../common/pageLinks/PageLinks";


// Dynamically import CreatePostModal with SSR disabled
const CreatePostModal = dynamic(() => import("./CreatePostModal"), {
  ssr: false,
});

const BlogPageContent = () => {
  const { posts, fetchPosts, loading, error } = useBlogPosts();
  const { role } = useRoles();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canCreatePost =
    Array.isArray(role) && (role.includes("Admin") || role.includes("Coach"));

  return (
    <main className="flex flex-col flex-1 items-center justify-center min-h-screen bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 px-4">
      <div className="w-full max-w-2xl bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-lg p-6 sm:p-10">
        <BlogHeader />
        {canCreatePost && (
          <CreatePostButton onClick={() => setModalOpen(true)} />
        )}
        {loading && (
          <div className="text-center text-blue-600 mb-4">Loading posts...</div>
        )}
        {error && <div className="text-center text-red-600 mb-4">{error}</div>}
        <BlogPostList posts={posts} />
        <PageLinks linksToShow={["/", "/about", "/contact"]} />
      </div>
      <CreatePostModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
};

export default BlogPageContent;
