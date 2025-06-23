'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from "react";
import { useApiRequest } from "../utils/api";
import { User } from "../types/User";

// Defines the shape of the UserContext, including data, loading states, errors, and API interaction functions.
interface UserContextType {
    users: User[];
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    getUserById: (id: number) => Promise<User | undefined>;
    createUser: (user: Partial<User>) => Promise<User | undefined>;
    updateUser: (id: number, user: Partial<User>) => Promise<User | undefined>;
    deleteUser: (id: number) => Promise<boolean>;
    reactivateUser: (id: number) => Promise<boolean>;
}

// Initializes the UserContext with default empty values.
const UserContext = createContext<UserContextType>({
    users: [],
    loading: false,
    error: null,
    fetchUsers: async () => { },
    getUserById: async () => undefined,
    createUser: async () => undefined,
    updateUser: async () => undefined,
    deleteUser: async () => false,
    reactivateUser: async () => false,
});

// 1. Context Hooks
// Custom hook to consume the UserContext, providing access to user data and functions.
export const useUsers = () => useContext(UserContext);

// 2. State Hooks and other React Hooks (useRef)
// Provides user data and interaction functionalities to its children components.
export const UserProvider = ({ children }: { children: ReactNode }) => {
    // State to hold the list of users.
    const [users, setUsers] = useState<User[]>([]);
    // State to indicate if an API request is currently in progress.
    const [loading, setLoading] = useState(false);
    // State to store any error messages from API requests.
    const [error, setError] = useState<string | null>(null);

    // Custom hook for making API requests.
    const { apiRequest } = useApiRequest();

    // Cache for getUserById to store previously fetched user data, preventing redundant API calls.
    const userCache = useRef<Map<number, User>>(new Map());

    // 4. Functions (memoized with useCallback)

    // Memoized function to fetch all users from the API.
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<User[]>("/Users");
            setUsers(data);
            // Populate cache with all fetched users to optimize subsequent getUserById calls.
            data.forEach(user => userCache.current.set(user.id, user));
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [apiRequest]); // Dependency array ensures the function is stable unless apiRequest changes.

    // Memoized function to fetch a single user by ID, utilizing an in-memory cache.
    const getUserById = useCallback(async (id: number) => {
        // Check if the user is already in the cache.
        if (userCache.current.has(id)) {
            return userCache.current.get(id);
        }

        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<User>(`/Users/${id}`);
            userCache.current.set(id, data); // Store the fetched user in cache.
            return data;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [apiRequest]); // Dependency array ensures the function is stable unless apiRequest changes.

    // Memoized function to create a new user.
    const createUser = useCallback(async (user: Partial<User>) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<User>("/Users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            setUsers(prev => [...prev, data]); // Add the new user to the local state.
            userCache.current.set(data.id, data); // Add the new user to the cache.
            return data;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [apiRequest]); // Dependency array ensures the function is stable unless apiRequest changes.

    // Memoized function to update an existing user.
    const updateUser = useCallback(async (id: number, user: Partial<User>) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<User>(`/Users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            setUsers(prev => prev.map(u => (u.id === id ? data : u))); // Update the user in the local state.
            userCache.current.set(id, data); // Update the user in the cache.
            return data;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [apiRequest]); // Dependency array ensures the function is stable unless apiRequest changes.

    // Memoized function to delete a user.
    const deleteUser = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await apiRequest<void>(`/Users/${id}`, { method: "DELETE" });
            setUsers(prev => prev.filter(u => u.id !== id)); // Remove the user from the local state.
            userCache.current.delete(id); // Remove the user from the cache.
            return true;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [apiRequest]); // Dependency array ensures the function is stable unless apiRequest changes.

    // Memoized function to reactivate a user.
    const reactivateUser = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await apiRequest<void>(`/Users/${id}/reactivate`, { method: "POST" });
            setUsers(prev => prev.map(u => (u.id === id ? { ...u, isActive: true } : u))); // Update active status in local state.
            // Update the cached user's status if it exists in the cache.
            if (userCache.current.has(id)) {
                const user = userCache.current.get(id);
                if (user) {
                    userCache.current.set(id, { ...user, isActive: true });
                }
            }
            return true;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [apiRequest]); // Dependency array ensures the function is stable unless apiRequest changes.


    // 5. Render
    // Provides the context values to all child components.
    return (
        <UserContext.Provider
            value={{
                users,
                loading,
                error,
                fetchUsers,
                getUserById,
                createUser,
                updateUser,
                deleteUser,
                reactivateUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};