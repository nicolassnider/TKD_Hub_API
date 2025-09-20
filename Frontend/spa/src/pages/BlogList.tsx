import React from "react";
import { useNavigate } from "react-router-dom";
import { useApiItems } from "../hooks/useApiItems";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Grid,
  Skeleton,
  Alert,
} from "@mui/material";
import { Person, CalendarToday, Visibility } from "@mui/icons-material";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const navigate = useNavigate();

  // Extract plain text from HTML and then truncate using pipe approach
  const getTextPreview = (htmlContent: string) => {
    // Create a truncate pipe function
    const truncate = (text: string, length: number) => 
      text.length > length ? text.substring(0, length) + "..." : text;
    
    // First decode HTML entities if they exist
    const tempDecoder = document.createElement("div");
    tempDecoder.innerHTML = htmlContent;
    const decodedHtml = tempDecoder.innerHTML;
    
    // Then extract plain text from the decoded HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = decodedHtml;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    
    return truncate(textContent, 200);
  };

  const handleReadMore = () => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <Card 
      sx={{ 
        display: 'flex',
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 'var(--shadow-lg)',
          borderColor: 'var(--border-accent)',
        },
        cursor: 'pointer'
      }}
      onClick={handleReadMore}
    >
      {/* Left side - Avatar and metadata */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          p: 3,
          minWidth: 160,
          background: 'linear-gradient(135deg, var(--primary-100) 0%, var(--accent-100) 100%)',
          borderRight: '1px solid var(--border)'
        }}
      >
        <Avatar 
          sx={{ 
            width: 56, 
            height: 56, 
            mb: 2, 
            bgcolor: 'var(--primary)',
            border: '2px solid var(--fg)'
          }}
        >
          <Person sx={{ color: 'var(--fg)' }} />
        </Avatar>
        
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'var(--fg)', 
            fontWeight: 600,
            textAlign: 'center',
            mb: 1
          }}
        >
          {post.authorName}
        </Typography>
        
        {(post.createdAt || post.updatedAt) && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarToday sx={{ fontSize: 12, color: 'var(--fg-muted)' }} />
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'var(--fg-muted)',
                fontSize: '0.7rem'
              }}
            >
              {new Date(post.createdAt || post.updatedAt || '').toLocaleDateString()}
            </Typography>
          </Box>
        )}
        
        {!post.isActive && (
          <Chip 
            label="Inactive" 
            size="small" 
            sx={{ 
              mt: 1,
              bgcolor: 'var(--warning)',
              color: 'var(--bg)',
              fontSize: '0.7rem'
            }} 
          />
        )}
      </Box>

      {/* Right side - Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent sx={{ flex: 1, p: 3 }}>
          {/* Title */}
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              lineHeight: 1.3,
              mb: 2,
              color: 'var(--fg)',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            {post.title}
          </Typography>

          {/* Content preview */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'var(--fg-muted)',
              lineHeight: 1.6,
              fontSize: '1rem'
            }}
          >
            {getTextPreview(post.content)}
          </Typography>
        </CardContent>

        <CardActions sx={{ p: 3, pt: 0, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            startIcon={<Visibility />}
            sx={{ 
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              '&:hover': {
                borderColor: 'var(--primary-600)',
                backgroundColor: 'var(--primary-50)'
              }
            }}
          >
            Read More
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}

function BlogPostSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
          <Box>
            <Skeleton variant="text" width={100} height={16} />
            <Skeleton variant="text" width={80} height={14} />
          </Box>
        </Box>
        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="60%" height={20} />
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Skeleton variant="rectangular" width={100} height={32} sx={{ ml: 'auto' }} />
      </CardActions>
    </Card>
  );
}

export default function BlogList() {
  const { items: posts, loading, error, reload } = useApiItems<BlogPost>("/api/BlogPosts");
  const navigate = useNavigate();

  if (error) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Blog
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Blog
        </Typography>
        <Box>
          <Button variant="outlined" onClick={reload} sx={{ mr: 2 }}>
            Refresh
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/blog/new')}
          >
            New Post
          </Button>
        </Box>
      </Box>

      {/* Blog posts grid */}
      <Grid container spacing={3}>
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} key={index}>
              <BlogPostSkeleton />
            </Grid>
          ))
        ) : posts.length === 0 ? (
          // Empty state
          <Grid item xs={12}>
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center"
              py={8}
              textAlign="center"
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No blog posts found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Start sharing your thoughts and experiences with the community.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/blog/new')}
              >
                Write Your First Post
              </Button>
            </Box>
          </Grid>
        ) : (
          // Blog posts - using full width cards
          posts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <BlogPostCard post={post} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
