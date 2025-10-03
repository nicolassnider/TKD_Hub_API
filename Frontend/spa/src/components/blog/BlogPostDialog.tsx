import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Article as ArticleIcon,
  Public as PublicIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { BlogPostManagement as BlogPost, BlogFormData } from "../../types/api";

interface BlogPostDialogProps {
  open: boolean;
  onClose: () => void;
  post: BlogPost | null;
  onSubmit: (data: BlogFormData) => Promise<void>;
  submitting: boolean;
}

const initialFormData: BlogFormData = {
  title: "",
  content: "",
  excerpt: "",
  isPublished: false,
  tags: "",
  featuredImage: "",
};

/**
 * Dialog component for creating and editing blog posts.
 * Provides a comprehensive form with validation and submission handling.
 */
export const BlogPostDialog: React.FC<BlogPostDialogProps> = ({
  open,
  onClose,
  post,
  onSubmit,
  submitting,
}) => {
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);

  React.useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        isPublished: post.isPublished,
        tags: post.tags.join(", "),
        featuredImage: post.featuredImage || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [post]);

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData((prev: BlogFormData) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const isValid = formData.title.trim() && formData.content.trim();

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            {post ? "Edit Blog Post" : "Create New Blog Post"}
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
          onClick={onClose}
          variant="outlined"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || !isValid}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            minWidth: 120,
            "&.Mui-disabled": {
              bgcolor: "action.disabledBackground",
            },
          }}
        >
          {submitting ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
