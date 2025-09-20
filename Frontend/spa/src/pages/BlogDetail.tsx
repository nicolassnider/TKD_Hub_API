import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJson, ApiError } from "../lib/api";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  Button,
  Divider,
  Skeleton,
  Alert,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  CalendarToday,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useRole } from "../context/RoleContext";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function BlogDetailSkeleton() {
  return (
    <Box>
      <Box mb={3}>
        <Skeleton variant="rectangular" width={80} height={36} />
      </Box>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
          <Box>
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={100} height={16} />
          </Box>
        </Box>
        <Skeleton variant="text" width="70%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} />
      </Paper>
    </Box>
  );
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useRole();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = Array.isArray(role) && role.includes("Admin");
  const canEdit = isAdmin; // Add more logic here if needed

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetchJson<BlogPost>(`/api/BlogPosts/${id}`);
        if (!mounted) return;
        setPost(res as unknown as BlogPost);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleEdit = () => {
    navigate(`/blog/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!post || !window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }
    try {
      await fetchJson(`/api/BlogPosts/${id}`, { method: "DELETE" });
      navigate("/blog");
    } catch (e) {
      console.error("Error deleting post:", e);
    }
  };

  if (loading) return <BlogDetailSkeleton />;
  
  if (error) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate("/blog")}
          sx={{ mb: 3 }}
        >
          Back to Blog
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  if (!post) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate("/blog")}
          sx={{ mb: 3 }}
        >
          Back to Blog
        </Button>
        <Alert severity="info">Post not found.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Back button */}
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate("/blog")}
        sx={{ mb: 3 }}
      >
        Back to Blog
      </Button>

      {/* Main content */}
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, sm: 4 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        {/* Author info and metadata */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                mr: 2, 
                bgcolor: 'primary.main' 
              }}
            >
              <Person />
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight={500}>
                {post.authorName}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {post.createdAt && new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <span> (Updated {new Date(post.updatedAt).toLocaleDateString()})</span>
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            {!post.isActive && (
              <Chip label="Inactive" size="small" color="warning" />
            )}
            {canEdit && (
              <>
                <IconButton onClick={handleEdit} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={handleDelete} color="error">
                  <Delete />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Title */}
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 3,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          {post.title}
        </Typography>

        {/* Content */}
        <Box
          sx={{
            '& p': { 
              mb: 2, 
              lineHeight: 1.7,
              fontSize: '1.1rem'
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 3,
              mb: 2,
              fontWeight: 600
            },
            '& ul, & ol': {
              mb: 2,
              pl: 3
            },
            '& li': {
              mb: 0.5
            },
            '& blockquote': {
              borderLeft: 4,
              borderColor: 'primary.main',
              pl: 2,
              ml: 0,
              fontStyle: 'italic',
              bgcolor: 'grey.50',
              p: 2,
              borderRadius: 1
            },
            '& code': {
              bgcolor: 'grey.100',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontFamily: 'monospace'
            },
            '& pre': {
              bgcolor: 'grey.100',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              '& code': {
                bgcolor: 'transparent',
                p: 0
              }
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1
            }
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Paper>
    </Box>
  );
}
