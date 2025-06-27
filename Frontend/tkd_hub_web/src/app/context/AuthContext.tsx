'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { isTokenExpired } from '../utils/auth';
import { useApiRequest } from '../utils/api';
import { User } from '../types/User';
import { useClasses } from './ClassContext';
import { useRanks } from './RankContext';
import { useTuls } from './TulContext';
import { useCoaches } from './CoachContext';
import { LoginResponse } from '../types/LoginResponse';
import { useRoles } from './RoleContext';
import { UserRole } from '../types/UserRole';

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    getToken: () => string | null;
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    login: async () => { },
    logout: () => { },
    getToken: () => null,
    user: null,
    loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { setRole } = useRoles(); // This updates RoleContext state and localStorage
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const { apiRequest } = useApiRequest();
    const { fetchClasses } = useClasses();
    const { fetchCoaches } = useCoaches();
    const { fetchRanks } = useRanks();
    const { fetchTuls } = useTuls();

    // On mount, check localStorage for auth state
    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role') as UserRole | null;

        if (!token || isTokenExpired(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            setRole(['Guest']); // Always update RoleContext
            setUser(null);
            setLoading(false);
            router.push('/login');
        } else {
            setIsLoggedIn(true);
            // Only set valid roles
            const validRoles: UserRole[] = ['Guest', 'Student', 'Coach', 'Admin'];
            setRole(
                validRoles.includes(storedRole as UserRole)
                    ? [(storedRole as UserRole)]
                    : ['Guest']
            );
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse stored user data:", e);
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        }
    }, [router, setRole]);

    // Fetch related data after login
    useEffect(() => {
        if (isLoggedIn) {
            fetchClasses();
            fetchCoaches();
            fetchRanks();
            fetchTuls();
        }
    }, [isLoggedIn, fetchClasses, fetchCoaches, fetchRanks, fetchTuls]);

    // Login function
    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const data = await apiRequest<LoginResponse>('/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!data.token) throw new Error('Invalid credentials');

            localStorage.setItem('token', data.token);

            let roleValue: UserRole = 'Student';
            if (data.user && Array.isArray(data.user.roles) && data.user.roles.length > 0) {
                roleValue = data.user.roles[0] as UserRole;
            } else if (data.user && data.user.roles) {
                roleValue = data.user.roles[0] as UserRole || 'Student';
            }
            localStorage.setItem('role', roleValue);
            localStorage.setItem('user', JSON.stringify(data.user));
            setRole([roleValue]); // Always update RoleContext
            setUser(data.user);
            setIsLoggedIn(true);
            toast.success('Login successful!');
            setLoading(false); // Set loading to false before redirect
            router.push('/');
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Login failed';
            toast.error(errorMsg);
            setIsLoggedIn(false);
            setRole(['Guest']); // Always update RoleContext
            setUser(null);
            setLoading(false);
        }
    }, [apiRequest, router, setRole]);

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setRole(['Guest']); // Always update RoleContext
        setUser(null);
        toast.success('Logout successful!');
        router.push('/login');
    }, [router, setRole]);

    // Get token function
    const getToken = useCallback(() => {
        return localStorage.getItem('token');
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout,
        getToken,
        user,
        loading,
    }), [isLoggedIn, login, logout, getToken, user, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
