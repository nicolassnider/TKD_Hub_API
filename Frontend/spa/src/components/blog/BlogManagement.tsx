import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Skeleton,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Visibility,
  Article as ArticleIcon,
  Public as PublicIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../layout/PageLayout";
import { EmptyState } from "../common/EmptyState";
import { BlogPostDto } from "../../types/api";

// Extended BlogPost interface with additional fields for management
interface BlogPost extends Omit<BlogPostDto, "isActive"> {
  excerpt: string;
  authorName: string;
  publishedAt?: string;
  isPublished: boolean; // Maps to isActive from BlogPostDto
  tags: string[];
  slug: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  isPublished: boolean;
  tags: string;
  featuredImage: string;
}

const initialFormData: BlogFormData = {
  title: "",
  content: "",
  excerpt: "",
  isPublished: false,
  tags: "",
  featuredImage: "",
};

export default function BlogManagement() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setError(null);
      const data = (await fetchJson("/api/blogposts")) as BlogPost[];
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
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        isPublished: post.isPublished,
        tags: post.tags.join(", "),
        featuredImage: post.featuredImage || "",
      });
    } else {
      setEditingPost(null);
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPost(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

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
        await fetchJson(`/api/blogposts/${editingPost.id}`, {
          method: "PUT",
          body: JSON.stringify(postData),
        });
        toast.success("Blog post updated successfully!");
      } else {
        await fetchJson("/api/blogposts", {
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
      await fetchJson(`/api/blogposts/${postId}`, { method: "DELETE" });
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

  const renderLoadingState = () => (
    <PageLayout
      title="Blog Management"
      actions={
        <Button variant="contained" startIcon={<Add />} disabled>
          Create Post
        </Button>
      }
    >
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ p: 2 }}>
            {[...Array(5)].map((_, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="80%" height={20} />
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </PageLayout>
  );

  if (loading) {
    return renderLoadingState();
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

  const renderBlogTable = () => (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600 }}>Post Details</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Publication</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tags</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow
                  key={post.id}
                  hover
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    "& .MuiTableCell-root": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {post.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          mt: 0.5,
                        }}
                      >
                        {post.excerpt}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {post.authorName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={post.isPublished ? "Published" : "Draft"}
                      color={post.isPublished ? "success" : "warning"}
                      variant={post.isPublished ? "filled" : "outlined"}
                      size="small"
                      icon={
                        post.isPublished ? <PublicIcon /> : <ScheduleIcon />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={
                        post.publishedAt ? "text.primary" : "text.secondary"
                      }
                    >
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "Not published"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.75rem" }}
                        />
                      ))}
                      {post.tags.length > 3 && (
                        <Chip
                          label={`+${post.tags.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.75rem" }}
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >
                      <Tooltip title="View Post">
                        <IconButton
                          size="small"
                          onClick={() => handleViewPost(post.slug)}
                          color="primary"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Post">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(post)}
                          color="info"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Post">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(post.id)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderErrorState = () => (
    <Alert
      severity="error"
      sx={{ mb: 3 }}
      action={
        <Button color="inherit" size="small" onClick={loadBlogPosts}>
          Retry
        </Button>
      }
    >
      {error}
    </Alert>
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
      {error && renderErrorState()}
      {blogPosts.length === 0 && !error
        ? renderEmptyState()
        : renderBlogTable()}{" "}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, minHeight: "60vh" },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <ArticleIcon color="primary" />
            <Typography variant="h6" component="span">
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Post Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
              fullWidth
              variant="outlined"
              helperText="Enter a compelling title for your blog post"
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />

            <TextField
              label="Excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              helperText="Brief description that will appear in previews (recommended: 150-160 characters)"
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />

            <TextField
              label="Content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              multiline
              rows={10}
              fullWidth
              required
              variant="outlined"
              helperText="Write your blog post content here (supports HTML)"
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />

            <Box display="flex" gap={2}>
              <TextField
                label="Featured Image URL"
                value={formData.featuredImage}
                onChange={(e) =>
                  handleInputChange("featuredImage", e.target.value)
                }
                fullWidth
                variant="outlined"
                helperText="Optional: Add a cover image URL"
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <FormControl fullWidth variant="outlined">
                <InputLabel>Publication Status</InputLabel>
                <Select
                  value={formData.isPublished ? "true" : "false"}
                  onChange={(e) =>
                    handleInputChange("isPublished", e.target.value === "true")
                  }
                  label="Publication Status"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="false">
                    <Box display="flex" alignItems="center" gap={1}>
                      <ScheduleIcon fontSize="small" />
                      Save as Draft
                    </Box>
                  </MenuItem>
                  <MenuItem value="true">
                    <Box display="flex" alignItems="center" gap={1}>
                      <PublicIcon fontSize="small" />
                      Publish Now
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Tags"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              fullWidth
              variant="outlined"
              helperText="Separate tags with commas (e.g., taekwondo, training, competition)"
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              submitting || !formData.title.trim() || !formData.content.trim()
            }
            sx={{
              textTransform: "none",
              borderRadius: 2,
              minWidth: 120,
              "&.Mui-disabled": {
                bgcolor: "action.disabledBackground",
              },
            }}
          >
            {submitting
              ? "Saving..."
              : editingPost
                ? "Update Post"
                : "Create Post"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
