"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useBlogPosts } from "@/app/context/BlogPostContext";
import { decodeHtml } from "@/app/utils/decodeHtml";

// 1. Context hooks
const BlogPostPage = () => {
  const { id } = useParams();
  const { post, loading, error, getPostById } = useBlogPosts();

  // 2. State hooks
  // (No local state hooks needed for this page)

  // 3. Effects
  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    getPostById(Number(id));
    // Only depend on id. If getPostById is not stable, memoize it in context/provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 4. Functions
  // (No local functions needed for this page)

  // 5. Render
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>No post found.</div>;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
      <div className="flex-1">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: decodeHtml(post.content) }} />
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-primary">Edit</button>
        <button className="btn btn-secondary">Delete</button>
      </div>
    </div>
  );
};

export default BlogPostPage;
