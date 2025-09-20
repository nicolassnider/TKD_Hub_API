import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Chip,
  Divider,
  Skeleton,
  Alert,
  Menu,
  MenuItem,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogContext } from "../context/BlogContext";
import { useRole } from "../context/RoleContext";
import { BlogEditor } from "./BlogEditor";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { BlogPost } from "../types/blog";
import { decodeHtml } from "../utils/htmlUtils";

export const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPost, loading, error, fetchPost, deletePost, getPermissions } =
    useBlogContext();
  const { hasRole, displayName } = useRole();
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id, 10));
    }
  }, [id, fetchPost]);

  const handleBack = () => {
    navigate("/blog");
  };

  const handleEdit = () => {
    setEditorOpen(true);
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleDeleteConfirm = async () => {
    if (currentPost) {
      await deletePost(currentPost.id);
      setDeleteDialogOpen(false);
      navigate("/blog");
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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

  const formatDateOnly = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={48} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={300} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Blog
        </Button>
      </Box>
    );
  }

  if (!currentPost) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Blog post not found
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Blog
        </Button>
      </Box>
    );
  }

  const permissions = getPermissions(currentPost);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="/blog"
          onClick={(e) => {
            e.preventDefault();
            handleBack();
          }}
          sx={{ cursor: "pointer" }}
        >
          Blog
        </Link>
        <Typography color="text.primary">
          {decodeHtml(currentPost.title)}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mt: -1 }}>
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {decodeHtml(currentPost.title)}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {currentPost.authorName || "Unknown Author"}
              </Typography>
              <Chip
                label={
                  hasRole("Admin")
                    ? "Admin"
                    : hasRole("Coach")
                      ? "Coach"
                      : "Member"
                }
                size="small"
                color={
                  hasRole("Admin")
                    ? "error"
                    : hasRole("Coach")
                      ? "primary"
                      : "default"
                }
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {formatDateOnly(currentPost.createdAt)}
              </Typography>
            </Box>

            {currentPost.updatedAt &&
              currentPost.updatedAt !== currentPost.createdAt && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon
                    sx={{ fontSize: 20, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Updated {formatDate(currentPost.updatedAt)}
                  </Typography>
                </Box>
              )}
          </Box>
        </Box>

        {(permissions.canEdit || permissions.canDelete) && (
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Content */}
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          minHeight: 300,
          "& p": { mb: 2 },
          "& h1, & h2, & h3, & h4, & h5, & h6": { mt: 3, mb: 1.5 },
          "& ul, & ol": { pl: 3, mb: 2 },
          "& li": { mb: 0.5 },
          "& blockquote": {
            borderLeft: "4px solid #ccc",
            pl: 2,
            ml: 1,
            fontStyle: "italic",
            color: "text.secondary",
          },
          "& code": {
            backgroundColor: "grey.100",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.875em",
            fontFamily: "monospace",
          },
          "& pre": {
            backgroundColor: "grey.100",
            p: 2,
            borderRadius: 1,
            overflow: "auto",
            mb: 2,
          },
          "& a": {
            color: "primary.main",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          },
          "& img": { maxWidth: "100%", height: "auto" },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {permissions.canEdit && (
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} />
            Edit Post
          </MenuItem>
        )}
        {permissions.canDelete && (
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete Post
          </MenuItem>
        )}
      </Menu>

      {/* Blog Editor Dialog */}
      <BlogEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        post={currentPost}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        entityName="blog post"
        entityDescription={currentPost.title}
      />
    </Box>
  );
};
