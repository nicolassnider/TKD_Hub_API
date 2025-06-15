'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useApiRequest } from "../utils/api";
import { User } from "../types/User";

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

})

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { apiRequest } = useApiRequest();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<User[]>("/Users");
            setUsers(data);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    const getUserById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<User>(`/Users/${id}`);
            return data;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    const createUser = useCallback(async (user: Partial<User>) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<User>("/Users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            setUsers(prev => [...prev, data]);
            return data;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    const updateUser = useCallback(async (id: number, user: Partial<User>) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<User>(`/Users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            setUsers(prev => prev.map(u => (u.id === id ? data : u)));
            return data;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    const deleteUser = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await apiRequest<void>(`/Users/${id}`, { method: "DELETE" });
            setUsers(prev => prev.filter(u => u.id !== id));
            return true;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error";
            setError(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    const reactivateUser = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
        await apiRequest<void>(`/Users/${id}/reactivate`, { method: "POST" });
        setUsers(prev => prev.map(u => (u.id === id ? { ...u, isActive: true } : u)));
        return true;
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        return false;
    } finally {
        setLoading(false);
    }
}, [apiRequest]);

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
