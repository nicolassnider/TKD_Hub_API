import React, { useState } from "react";
import { Box, Typography, Fab, Chip } from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { useBlogContext } from "../context/BlogContext";
import { useRole } from "../context/RoleContext";
import { BlogEditor } from "./BlogEditor";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { BlogPost } from "../types/blog";
import { decodeHtml, getHtmlPreview } from "../utils/htmlUtils";
import { GenericEntityList } from "./common";
import {
  EntityAction,
  createEditAction,
  createDeleteAction,
} from "./EntityActions";

export const BlogList: React.FC = () => {
  const { posts, loading, error, deletePost, getPermissions } =
    useBlogContext();
  const { hasRole } = useRole();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Get permissions for creating posts (Admin and Coach can create)
  const permissions = getPermissions();

  const handleCreatePost = () => {
    setSelectedPost(null);
    setEditorMode("create");
    setEditorOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setEditorMode("edit");
    setEditorOpen(true);
  };

  const handleDeletePost = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      await deletePost(postToDelete.id);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const canEditPost = (post: BlogPost) => {
    const postPermissions = getPermissions(post);
    return postPermissions.canEdit;
  };

  const canDeletePost = (post: BlogPost) => {
    const postPermissions = getPermissions(post);
    return postPermissions.canDelete;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPostActions = (post: BlogPost): EntityAction[] => {
    const actions: EntityAction[] = [];

    if (canEditPost(post)) {
      actions.push(createEditAction(() => handleEditPost(post)));
    }

    if (canDeletePost(post)) {
      actions.push(createDeleteAction(() => handleDeletePost(post)));
    }

    return actions;
  };

  const renderPost = (post: BlogPost) => (
    <>
      <Typography variant="h6" component="h2" sx={{ mb: 2, pr: 4 }}>
        {decodeHtml(post.title)}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        <Typography variant="body2" color="text.secondary">
          {post.authorName}
        </Typography>
        <Chip
          label={
            hasRole("Admin") ? "Admin" : hasRole("Coach") ? "Coach" : "Member"
          }
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <TimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        <Typography variant="body2" color="text.secondary">
          {formatDate(post.createdAt)}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1.5,
          maxHeight: "4.5em",
          mb: 2,
        }}
      >
        {getHtmlPreview(post.content, 150)}
      </Typography>

      {/* Tags could be added here if the BlogPost type includes them */}
    </>
  );

  return (
    <>
      <GenericEntityList
        items={posts}
        loading={loading}
        error={error}
        title="Blog Posts"
        onAdd={permissions.canCreate ? handleCreatePost : undefined}
        addButtonText="New Post"
        renderItem={renderPost}
        getItemActions={getPostActions}
        getItemKey={(post) => post.id}
        gridProps={{ xs: 12, md: 6, lg: 4 }}
        emptyTitle="No blog posts yet"
        emptyDescription="Create your first blog post to get started"
        emptyActionLabel="Create First Post"
      />

      {/* Floating Action Button for mobile */}
      {permissions.canCreate && (
        <Fab
          color="primary"
          aria-label="add post"
          onClick={handleCreatePost}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { xs: "flex", sm: "none" },
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Blog Editor Dialog */}
      <BlogEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        mode={editorMode}
        post={selectedPost}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        entityName="Blog Post"
        entityDescription={postToDelete?.title}
      />
    </>
  );
};
