import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Fab,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useBlogContext } from '../context/BlogContext';
import { useRole } from '../context/RoleContext';
import { BlogEditor } from './BlogEditor';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { BlogPost } from '../types/blog';
import { decodeHtml, getHtmlPreview } from '../utils/htmlUtils';

export const BlogList: React.FC = () => {
  const { posts, loading, error, deletePost, getPermissions } = useBlogContext();
  const { hasRole, isAdmin, displayName } = useRole();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPost, setMenuPost] = useState<BlogPost | null>(null);

  // Get permissions for creating posts (Admin and Coach can create)
  const permissions = getPermissions();

  const handleCreatePost = () => {
    setSelectedPost(null);
    setEditorMode('create');
    setEditorOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setEditorMode('edit');
    setEditorOpen(true);
    handleCloseMenu();
  };

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      await deletePost(postToDelete.id);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, post: BlogPost) => {
    setAnchorEl(event.currentTarget);
    setMenuPost(post);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuPost(null);
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
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && posts.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Blog Posts
        </Typography>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
                  <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Skeleton variant="rectangular" width={60} height={20} />
                    <Skeleton variant="rectangular" width={80} height={20} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pb: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Blog Posts
        </Typography>
        {permissions.canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreatePost}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            New Post
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {posts.length === 0 && !loading ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No blog posts yet
            </Typography>
            {permissions.canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreatePost}
                sx={{ mt: 2 }}
              >
                Create First Post
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ flexGrow: 1, mr: 1 }}>
                      {decodeHtml(post.title)}
                    </Typography>
                    {(canEditPost(post) || canDeletePost(post)) && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, post)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.authorName}
                    </Typography>
                    <Chip 
                      label={hasRole('Admin') ? 'Admin' : hasRole('Coach') ? 'Coach' : 'Member'} 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {getHtmlPreview(post.content, 150)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                    <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button for mobile */}
      {permissions.canCreate && (
        <Fab
          color="primary"
          aria-label="add post"
          onClick={handleCreatePost}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' }
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {menuPost && canEditPost(menuPost) && (
          <MenuItem onClick={() => handleEditPost(menuPost)}>
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        )}
        {menuPost && canDeletePost(menuPost) && (
          <MenuItem onClick={() => handleDeleteClick(menuPost)}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>

      {/* Blog Editor Dialog */}
      <BlogEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        post={selectedPost}
        mode={editorMode}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        entityName="blog post"
        entityDescription={postToDelete?.title || ''}
      />
    </Box>
  );
};
