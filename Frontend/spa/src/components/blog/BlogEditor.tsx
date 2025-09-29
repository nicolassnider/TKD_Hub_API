import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  Toolbar,
  Paper,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Code,
} from "@mui/icons-material";
import { CreateBlogPostDto, UpdateBlogPostDto } from "../../types/blog";
import { useBlogContext } from "../../context/BlogContext";

interface BlogEditorProps {
  open: boolean;
  onClose: () => void;
  post?: {
    id: number;
    title: string;
    content: string;
  } | null;
  mode: "create" | "edit";
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  open,
  onClose,
  post,
  mode,
}) => {
  const { createPost, updatePost, loading } = useBlogContext();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [post, open]);

  const handleClose = () => {
    setTitle("");
    setContent("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      if (mode === "create") {
        await createPost({ title: title.trim(), content: content.trim() });
      } else if (mode === "edit" && post) {
        await updatePost(post.id, {
          title: title.trim(),
          content: content.trim(),
        });
      }
      handleClose();
    } catch (error) {
      console.error("Error saving blog post:", error);
    }
  };

  // Simple formatting functions
  const insertFormatting = (startTag: string, endTag: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newContent =
      content.substring(0, start) +
      startTag +
      selectedText +
      endTag +
      content.substring(end);

    setContent(newContent);

    // Set cursor position
    setTimeout(() => {
      if (selectedText) {
        textarea.setSelectionRange(
          start + startTag.length,
          end + startTag.length,
        );
      } else {
        textarea.setSelectionRange(
          start + startTag.length,
          start + startTag.length,
        );
      }
      textarea.focus();
    }, 0);
  };

  const formatButtons = [
    {
      icon: <FormatBold />,
      action: () => insertFormatting("<strong>", "</strong>"),
      tooltip: "Bold",
    },
    {
      icon: <FormatItalic />,
      action: () => insertFormatting("<em>", "</em>"),
      tooltip: "Italic",
    },
    {
      icon: <FormatUnderlined />,
      action: () => insertFormatting("<u>", "</u>"),
      tooltip: "Underline",
    },
    {
      icon: <FormatListBulleted />,
      action: () => insertFormatting("<ul><li>", "</li></ul>"),
      tooltip: "Bullet List",
    },
    {
      icon: <FormatListNumbered />,
      action: () => insertFormatting("<ol><li>", "</li></ol>"),
      tooltip: "Numbered List",
    },
    {
      icon: <Link />,
      action: () => insertFormatting('<a href="URL">', "</a>"),
      tooltip: "Link",
    },
    {
      icon: <Code />,
      action: () => insertFormatting("<code>", "</code>"),
      tooltip: "Code",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: "80vh" },
      }}
    >
      <DialogTitle>
        {mode === "create" ? "Create New Blog Post" : "Edit Blog Post"}
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          variant="outlined"
          required
        />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Content
          </Typography>

          {/* Simple formatting toolbar */}
          <Paper variant="outlined" sx={{ mb: 1 }}>
            <Toolbar variant="dense" sx={{ minHeight: 48 }}>
              {formatButtons.map((button, index) => (
                <IconButton
                  key={index}
                  size="small"
                  onClick={button.action}
                  title={button.tooltip}
                >
                  {button.icon}
                </IconButton>
              ))}
            </Toolbar>
          </Paper>

          <TextField
            inputRef={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={12}
            fullWidth
            variant="outlined"
            placeholder="Write your blog post content here... You can use HTML tags for formatting."
            required
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "monospace",
                fontSize: "14px",
              },
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            You can use HTML tags like &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;,
            &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;code&gt;, &lt;p&gt;,
            &lt;br&gt;, etc.
          </Typography>
        </Box>

        {content && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Preview
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                maxHeight: 200,
                overflow: "auto",
                backgroundColor: "grey.50",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !title.trim() || !content.trim()}
        >
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Post"
              : "Update Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
