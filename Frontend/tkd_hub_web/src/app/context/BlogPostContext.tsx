"use client";

// 1. External imports
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useRef, // Import useRef for caching
    useEffect, // Import useEffect for initial fetch
} from "react";
import toast from "react-hot-toast";

// 2. App/context/component imports
import { useApiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";
import { BlogPost } from "../types/BlogPost"; // Ensure this type is correctly defined

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
    const [post, setPost] = useState<BlogPost | null>(null); // This state will hold the result of getPostById

    // 3. Cache refs for memoization
    const postByIdCache = useRef<Map<number, BlogPost>>(new Map());
    const postsListCache = useRef<BlogPost[] | null>(null); // Cache for the entire list of posts

    // --- GET /BlogPosts ---
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Remove token check for anonymous access
            const response = await apiRequest<{ data: BlogPost[] }>(
                "/BlogPosts",
                {
                    method: "GET",
                    allowAnonymous: true
                }
            );
            const fetchedPosts = Array.isArray(response.data) ? response.data : [];
            setPosts(fetchedPosts);
            postsListCache.current = fetchedPosts; // Cache the full list

            // Populate individual post cache only if ID exists
            fetchedPosts.forEach(p => {
                if (p.id !== undefined && p.id !== null) {
                    postByIdCache.current.set(p.id, p);
                }
            });

        } catch (err: unknown) {
            setPosts([]);
            const message = err instanceof Error ? err.message : 'Failed to fetch blog posts.';
            setError(message);
            toast.error(message);
            console.error('Failed to fetch blog posts:', err);
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    // Initial fetch of all posts on component mount
    useEffect(() => {
        // Only fetch if posts are not already loaded to prevent unnecessary calls
        // Also check if postsListCache is null to ensure initial fetch logic runs
        if (posts.length === 0 && !loading && !error && postsListCache.current === null) {
            fetchPosts();
        }
    }, [fetchPosts, posts.length, loading, error]);


    // --- GET /BlogPosts/:id ---
    const getPostById = useCallback(
        async (id: number): Promise<BlogPost | null> => {
            // Check cache first
            if (postByIdCache.current.has(id)) {
                const cachedPost = postByIdCache.current.get(id)!;
                setPost(cachedPost);
                return cachedPost;
            }

            setLoading(true);
            setError(null);
            try {
                // Remove token check for anonymous access
                const response = await apiRequest<{ data: BlogPost }>(`/BlogPosts/${id}`, {
                    method: "GET",
                    allowAnonymous: true,
                });
                postByIdCache.current.set(id, response.data);
                setPost(response.data);
                return response.data;
            } catch (e: unknown) {
                const message = (e instanceof Error) ? e.message : 'Failed to fetch blog post by ID.';
                setError(message);
                toast.error(message);
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
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                await apiRequest("/BlogPosts", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postData),
                });
                toast.success("Blog post added successfully.");
                // Invalidate all caches after adding a new post
                postByIdCache.current.clear();
                postsListCache.current = null; // Invalidate the list cache
                await fetchPosts(); // Re-fetch to update main state and repopulate caches
            } catch (e: unknown) {
                let apiMessage = "Failed to add blog post.";
                if (typeof e === "object" && e !== null) {
                    if ("message" in e && typeof (e as { message: unknown }).message === "string") {
                        apiMessage = (e as { message: string }).message;
                    } else if ("response" in e && typeof (e as { response: { data?: { message?: unknown } } }).response?.data?.message === "string") {
                        apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
                    }
                }
                setError(apiMessage);
                toast.error(apiMessage);
                console.error("Failed to add blog post:", e);
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
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                await apiRequest(`/BlogPosts/${id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postData),
                });
                toast.success("Blog post updated successfully.");
                // Invalidate specific post from cache and the full list cache
                postByIdCache.current.delete(id);
                postsListCache.current = null; // Invalidate the list cache
                await fetchPosts(); // Re-fetch to update main state and repopulate caches
            } catch (e: unknown) {
                let apiMessage = "Failed to update blog post.";
                if (typeof e === "object" && e !== null) {
                    if ("message" in e && typeof (e as { message: unknown }).message === "string") {
                        apiMessage = (e as { message: string }).message;
                    } else if ("response" in e && typeof (e as { response: { data?: { message?: unknown } } }).response?.data?.message === "string") {
                        apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
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
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                await apiRequest(`/BlogPosts/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Blog post deleted successfully.");
                // Invalidate specific post from cache and the full list cache
                postByIdCache.current.delete(id);
                postsListCache.current = null; // Invalidate the list cache
                await fetchPosts(); // Re-fetch to update main state and repopulate caches
            } catch (e: unknown) {
                let apiMessage = "Failed to delete blog post.";
                if (typeof e === "object" && e !== null) {
                    if ("message" in e && typeof (e as { message: unknown }).message === "string") {
                        apiMessage = (e as { message: string }).message;
                    } else if (
                        "response" in e &&
                        typeof (e as { response: { data?: unknown } }).response?.data === "object" &&
                        (e as { response: { data: { message?: unknown } } }).response?.data &&
                        "message" in (e as { response: { data: { message?: unknown } } }).response.data &&
                        typeof (e as { response: { data: { message: unknown } } }).response.data.message === "string"
                    ) {
                        apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
                    } else if (
                        "response" in e &&
                        typeof (e as { response: { data?: unknown } }).response?.data === "string"
                    ) {
                        apiMessage = (e as { response: { data: string } }).response.data;
                    }
                }
                setError(apiMessage);
                toast.error(apiMessage);
                console.error("Failed to delete blog post:", e);
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
