"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useBlogPosts } from "@/app/context/BlogPostContext";
import BlogPostContent from "@/app/components/blogPost/BlogPostContent";

const BlogPostPage = () => {
  const { id } = useParams();
  const { post, loading, error, getPostById } = useBlogPosts();

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    getPostById(Number(id));
    // Only depend on id. If getPostById is not stable, memoize it in context/provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading)
    return <div className="text-center text-blue-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!post) return <div className="text-center">No post found.</div>;

  return <BlogPostContent post={post} />;
};

export default BlogPostPage;
