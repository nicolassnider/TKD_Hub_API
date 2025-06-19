"use client";

// 1. External imports
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import toast from "react-hot-toast";

// 2. App/context/component imports
import { useApiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";
import { BlogPost } from "../types/BlogPost";

// Define the context type
type BlogPostContextType = {
  post: BlogPost | null;
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  getPostById: (id: number) => Promise<BlogPost | null>;
  addPost: (post: Omit<BlogPost, "id">) => Promise<void>;
  updatePost: (id: number, post: Omit<BlogPost, "id">) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
};

// Create and export the context
const BlogPostContext = createContext<BlogPostContextType>({
  post: null,
  posts: [],
  loading: false,
  error: null,
  fetchPosts: async () => { },
  getPostById: async () => null,
  addPost: async () => { },
  updatePost: async () => { },
  deletePost: async () => { },
});

// Custom hook for consuming the context
export const useBlogPosts = () => useContext(BlogPostContext);

export const BlogPostProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 1. Context hooks
  const { getToken } = useAuth();
  const { apiRequest } = useApiRequest();

  // 2. State hooks
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);


  // --- GET /BlogPosts ---
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ data: BlogPost[] }>(
        "/BlogPosts",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch {
      setPosts([]);
      setError("Failed to fetch blog posts.");
      toast.error("Failed to fetch blog posts.");
    } finally {
      setLoading(false);
    }
  }, [apiRequest, getToken]);

  // --- GET /BlogPosts/:id ---
  const getPostById = useCallback(
    async (id: number): Promise<BlogPost | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest<{ data: BlogPost }>(`/BlogPosts/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPost(response.data);
        return response.data;
      } catch (e) {
        setError("Failed to fetch blog post by ID.");
        toast.error("Failed to fetch blog post by ID.");
        console.error("Failed to fetch blog post by ID:", e);
        setPost(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  // --- POST /BlogPosts ---
  const addPost = useCallback(
    async (postData: Omit<BlogPost, "id">) => {
      setLoading(true);
      setError(null);
      try {
        await apiRequest("/BlogPosts", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
        toast.success("Blog post added successfully.");
        await fetchPosts();
      } catch (e: unknown) {
        let apiMessage = "Failed to add blog post.";
        if (typeof e === "object" && e !== null) {
          if (
            "message" in e &&
            typeof (e as { message: unknown }).message === "string"
          ) {
            apiMessage = (e as { message: string }).message;
          } else if (
            "response" in e &&
            typeof (e as { response: { data?: { message?: unknown } } })
              .response?.data?.message === "string"
          ) {
            apiMessage = (
              e as { response: { data: { message: string } } }
            ).response.data.message;
          }
        }
        setError(apiMessage);
        toast.error(apiMessage);
      } finally {
        setLoading(false);
      }
    },
    [apiRequest, getToken, fetchPosts]
  );

  // --- PUT /BlogPosts/:id ---
  const updatePost = useCallback(
    async (id: number, postData: Omit<BlogPost, "id">) => {
      setLoading(true);
      setError(null);
      try {
        await apiRequest(`/BlogPosts/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
        toast.success("Blog post updated successfully.");
        await fetchPosts();
      } catch (e: unknown) {
        let apiMessage = "Failed to update blog post.";
        if (typeof e === "object" && e !== null) {
          if (
            "message" in e &&
            typeof (e as { message: unknown }).message === "string"
          ) {
            apiMessage = (e as { message: string }).message;
          } else if (
            "response" in e &&
            typeof (e as { response: { data?: { message?: unknown } } })
              .response?.data?.message === "string"
          ) {
            apiMessage = (
              e as { response: { data: { message: string } } }
            ).response.data.message;
          }
        }
        setError(apiMessage);
        toast.error(apiMessage);
        console.error("Failed to update blog post:", e);
      } finally {
        setLoading(false);
      }
    },
    [apiRequest, getToken, fetchPosts]
  );

  // --- DELETE /BlogPosts/:id ---
  const deletePost = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        await apiRequest(`/BlogPosts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        toast.success("Blog post deleted successfully.");
        await fetchPosts();
      } catch (e: unknown) {
        let apiMessage = "Failed to delete blog post.";
        if (typeof e === "object" && e !== null) {
          if (
            "message" in e &&
            typeof (e as { message: unknown }).message === "string"
          ) {
            apiMessage = (e as { message: string }).message;
          } else if (
            "response" in e &&
            typeof (e as { response: { data?: unknown } }).response
              ?.data === "object" &&
            (e as { response: { data: { message?: unknown } } })
              .response?.data &&
            "message" in
            (e as { response: { data: { message?: unknown } } })
              .response.data &&
            typeof (e as { response: { data: { message: unknown } } })
              .response.data.message === "string"
          ) {
            apiMessage = (
              e as { response: { data: { message: string } } }
            ).response.data.message;
          } else if (
            "response" in e &&
            typeof (e as { response: { data?: unknown } }).response
              ?.data === "string"
          ) {
            apiMessage = (e as { response: { data: string } }).response.data;
          }
        }
        setError(apiMessage);
        toast.error(apiMessage);
      } finally {
        setLoading(false);
      }
    },
    [apiRequest, getToken, fetchPosts]
  );

  // 5. Render
  return (
    <BlogPostContext.Provider
      value={{
        post,
        posts,
        loading,
        error,
        fetchPosts,
        getPostById,
        addPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </BlogPostContext.Provider>
  );
};
