import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Delete,
  Edit,
  Visibility,
  Public as PublicIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { BlogPostManagement as BlogPost } from "../../types/api";

interface BlogPostTableProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: number) => void;
  onView: (slug: string) => void;
}

/**
 * A table component for displaying blog posts with actions.
 * Provides view, edit, and delete functionality for each post.
 */
export const BlogPostTable: React.FC<BlogPostTableProps> = ({
  posts,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
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
              {posts.map((post) => (
                <BlogPostTableRow
                  key={post.id}
                  post={post}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

interface BlogPostTableRowProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: number) => void;
  onView: (slug: string) => void;
}

const BlogPostTableRow: React.FC<BlogPostTableRowProps> = ({
  post,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <TableRow
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
          icon={post.isPublished ? <PublicIcon /> : <ScheduleIcon />}
        />
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color={post.publishedAt ? "text.primary" : "text.secondary"}
        >
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
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
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Tooltip title="View Post">
            <IconButton
              size="small"
              onClick={() => onView(post.slug)}
              color="primary"
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Post">
            <IconButton size="small" onClick={() => onEdit(post)} color="info">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Post">
            <IconButton
              size="small"
              onClick={() => onDelete(post.id)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
