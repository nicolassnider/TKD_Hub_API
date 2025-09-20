import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { fetchJson, ApiError } from '../lib/api';
import { BlogPost, CreateBlogPostDto, UpdateBlogPostDto, BlogPermissions } from '../types/blog';
import { useRole } from './RoleContext';

interface BlogContextType {
  // State
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPosts: () => Promise<void>;
  fetchPost: (id: number) => Promise<BlogPost | null>;
  createPost: (data: CreateBlogPostDto) => Promise<BlogPost>;
  updatePost: (id: number, data: UpdateBlogPostDto) => Promise<BlogPost>;
  deletePost: (id: number) => Promise<void>;
  
  // Permissions
  getPermissions: (post?: BlogPost) => BlogPermissions;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { token, hasRole, isAdmin } = useRole();

  // Helper to get auth headers
  const getAuthHeaders = () => {
    if (!token) {
      throw new Error('Authentication required');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Fetch all blog posts
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchJson<BlogPost[]>('/api/BlogPosts');
      setPosts(response);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch blog posts';
      setError(errorMessage);
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single blog post
  const fetchPost = useCallback(async (id: number): Promise<BlogPost | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchJson<BlogPost>(`/api/BlogPosts/${id}`);
      setCurrentPost(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch blog post';
      setError(errorMessage);
      console.error('Error fetching blog post:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new blog post
  const createPost = useCallback(async (data: CreateBlogPostDto): Promise<BlogPost> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/BlogPosts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError('Failed to create blog post', response.status);
      }

      const newPost: BlogPost = await response.json();
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to create blog post';
      setError(errorMessage);
      console.error('Error creating blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update an existing blog post
  const updatePost = useCallback(async (id: number, data: UpdateBlogPostDto): Promise<BlogPost> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/BlogPosts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError('Failed to update blog post', response.status);
      }

      const updatedPost: BlogPost = await response.json();
      setPosts(prev => prev.map(post => post.id === id ? updatedPost : post));
      if (currentPost?.id === id) {
        setCurrentPost(updatedPost);
      }
      return updatedPost;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update blog post';
      setError(errorMessage);
      console.error('Error updating blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, currentPost]);

  // Delete a blog post
  const deletePost = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/BlogPosts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new ApiError('Failed to delete blog post', response.status);
      }

      setPosts(prev => prev.filter(post => post.id !== id));
      if (currentPost?.id === id) {
        setCurrentPost(null);
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete blog post';
      setError(errorMessage);
      console.error('Error deleting blog post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, currentPost]);

  // Get permissions for blog operations
  const getPermissions = useCallback((post?: BlogPost): BlogPermissions => {
    // Everyone can view blog posts
    const canView = true;
    
    // Only Admin and Coach can create posts
    const canCreate = hasRole('Admin') || hasRole('Coach');
    
    // Admin can edit/delete any post, Coach can edit/delete their own posts
    const canEdit = isAdmin() || (hasRole('Coach') && post?.authorId === parseInt(token?.split('.')[1] || '0'));
    const canDelete = canEdit; // Same permissions as edit
    
    return {
      canView,
      canCreate,
      canEdit,
      canDelete,
    };
  }, [hasRole, isAdmin, token]);

  const value: BlogContextType = {
    posts,
    currentPost,
    loading,
    error,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    getPermissions,
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};
