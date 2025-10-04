import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Add, Article as ArticleIcon } from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../layout/PageLayout";
import { EmptyState } from "../common/EmptyState";
import { BlogPostTable } from "./BlogPostTable";
import { BlogPostDialog } from "./BlogPostDialog";
import { BlogPostsLoadingState } from "./BlogPostLoadingState";
import { BlogPostsErrorState } from "./BlogPostErrorState";
import { BlogPostManagement as BlogPost, BlogFormData } from "../../types/api";

export default function BlogManagement() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setError(null);
      const data = (await fetchJson("/api/BlogPosts")) as BlogPost[];
      setBlogPosts(data);
    } catch (error) {
      const errorMessage = "Failed to load blog posts. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (post?: BlogPost) => {
    setEditingPost(post || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = async (formData: BlogFormData) => {
    setSubmitting(true);
    try {
      const postData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        featuredImage: formData.featuredImage || null,
      };

      if (editingPost) {
        await fetchJson(`/api/BlogPosts/${editingPost.id}`, {
          method: "PUT",
          body: JSON.stringify(postData),
        });
        toast.success("Blog post updated successfully!");
      } else {
        await fetchJson("/api/BlogPosts", {
          method: "POST",
          body: JSON.stringify(postData),
        });
        toast.success("Blog post created successfully!");
      }

      handleCloseDialog();
      await loadBlogPosts();
    } catch (error) {
      toast.error(
        editingPost
          ? "Failed to update blog post. Please try again."
          : "Failed to create blog post. Please try again.",
      );
      console.error("Error saving blog post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await fetchJson(`/api/BlogPosts/${postId}`, { method: "DELETE" });
      toast.success("Blog post deleted successfully");
      loadBlogPosts();
    } catch (error) {
      toast.error("Failed to delete blog post");
      console.error("Error deleting blog post:", error);
    }
  };

  const handleViewPost = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  if (loading) {
    return (
      <PageLayout
        title="Blog Management"
        actions={
          <Button variant="contained" startIcon={<Add />} disabled>
            Create Post
          </Button>
        }
      >
        <BlogPostsLoadingState />
      </PageLayout>
    );
  }

  const renderEmptyState = () => (
    <EmptyState
      icon={<ArticleIcon sx={{ fontSize: 64, color: "text.disabled" }} />}
      title="No Blog Posts Yet"
      description="Create your first blog post to get started with content management."
      actionLabel="Create First Post"
      onAction={() => handleOpenDialog()}
    />
  );

  return (
    <PageLayout
      title="Blog Management"
      actions={
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ textTransform: "none" }}
          disabled={loading}
        >
          Create Post
        </Button>
      }
    >
      {error && <BlogPostsErrorState error={error} onRetry={loadBlogPosts} />}

      {blogPosts.length === 0 && !error ? (
        renderEmptyState()
      ) : (
        <BlogPostTable
          posts={blogPosts}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
          onView={handleViewPost}
        />
      )}

      <BlogPostDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        post={editingPost}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </PageLayout>
  );
}
