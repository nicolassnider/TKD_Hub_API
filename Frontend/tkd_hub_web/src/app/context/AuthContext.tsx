'use client';

// 1. External imports
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// 2. App/context/component imports
import { isTokenExpired } from '../utils/auth';
import { useApiRequest } from '../utils/api';
import { User } from '../types/User'; // Adjust path if necessary
import { useClasses } from './ClassContext';
import { useRanks } from './RankContext';
import { useTuls } from './TulContext';
import { useCoaches } from './CoachContext';
import { LoginResponse } from '../types/LoginResponse';

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    getToken: () => string | null;
    role: string | null;
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    login: async () => {},
    logout: () => {},
    getToken: () => null,
    role: null,
    user: null,
    loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // 2. State hooks
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. Context hooks
    const router = useRouter();
    const { apiRequest } = useApiRequest();
    // Destructure functions from other contexts (note: these are already memoized in their own contexts)
    const { fetchClasses } = useClasses();
    const { fetchCoaches } = useCoaches();
    const { fetchRanks } = useRanks();
    const { fetchTuls } = useTuls();

    // 3. Effects
    // Check token and restore user on mount
    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (!token || isTokenExpired(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            setRole(null);
            setUser(null);
            setLoading(false);
            router.push('/login'); // Redirect to login if token is expired or missing
        } else {
            setIsLoggedIn(true);
            setRole(storedRole);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse stored user data:", e);
                    // Clear corrupted data if parsing fails
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        }
    }, [router]); // `router` is a stable object provided by `next/navigation`

    // Fetch essential data after login (or on initial load if already logged in)
    // Dependencies: isLoggedIn state, and the memoized fetch functions from other contexts.
    // If fetch functions are not memoized, this useEffect could run excessively.
    useEffect(() => {
        if (isLoggedIn) {
            fetchClasses(); // Call the memoized fetch functions
            fetchCoaches();
            fetchRanks();
            fetchTuls();
        }
    }, [isLoggedIn, fetchClasses, fetchCoaches, fetchRanks, fetchTuls]);

    // 4. Functions
    // --- Auth Login Endpoint ---
    const login = useCallback(async (email: string, password: string) => { // Wrap login in useCallback
        setLoading(true);
        try {
            const data = await apiRequest<LoginResponse>('/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!data.token) throw new Error('Invalid credentials');

            localStorage.setItem('token', data.token);

            let roleValue = 'Student';
            if (
                data.user &&
                data.user.roles &&
                Array.isArray(data.user.roles) &&
                data.user.roles.length > 0
            ) {
                roleValue = data.user.roles[0];
            } else if (data.user && data.user.roles) {
                // This case handles if data.user.roles is not an array but exists (e.g., a single string)
                // However, your LoginResponse type should ideally define roles as string[]
                roleValue = data.user.roles[0] || 'Student'; // Assuming roles[0] works for non-array too
            }
            localStorage.setItem('role', roleValue);
            localStorage.setItem('user', JSON.stringify(data.user));
            setRole(roleValue);
            setUser(data.user);
            setIsLoggedIn(true);
            toast.success('Login successful!');
            router.push('/');
        } catch (err) {
            const errorMsg =
                err instanceof Error ? err.message : 'Login failed';
            toast.error(errorMsg);
            setIsLoggedIn(false);
            setRole(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, router]); // Add apiRequest and router to dependencies

    const logout = useCallback(() => { // Wrap logout in useCallback
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setRole(null);
        setUser(null);
        toast.success('Logout successful!');
        router.push('/login');
    }, [router]); // Add router to dependencies

    const getToken = useCallback(() => { // Wrap getToken in useCallback
        return localStorage.getItem('token');
    }, []); // No dependencies, as localStorage is a global API

    // 5. Render
    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                login,
                logout,
                getToken,
                role,
                user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);