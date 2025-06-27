'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { isTokenExpired } from '../utils/auth';
import { useAuth } from './AuthContext';
import { UserRole } from '../types/UserRole';

type RoleContextType = {
    role: UserRole[];
    setRole: (role: UserRole[]) => void;
    getRole: () => UserRole[];
    roleLoading: boolean;
};

const RoleContext = createContext<RoleContextType>({
    role: ['Guest'],
    setRole: () => { },
    getRole: () => ['Guest'],
    roleLoading: true,
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { getToken, user } = useAuth();
    const [role, setRoleState] = useState<UserRole[]>(['Guest']);
    const [roleLoading, setRoleLoading] = useState(true);

    const setRole = (newRole: UserRole | UserRole[]) => {
        const rolesArray = Array.isArray(newRole) ? newRole : [newRole];
        setRoleState(rolesArray);
        if (typeof window !== 'undefined') {
            if (rolesArray.includes('Guest')) {
                localStorage.removeItem('role');
            } else {
                localStorage.setItem('role', JSON.stringify(rolesArray));
            }
        }
    };

    const getRole = () => role;

    useEffect(() => {
        const token = getToken();
        const validRoles: UserRole[] = ['Guest', 'Student', 'Coach', 'Admin'];

        // If no token or expired, use Guest or localStorage
        if (!token || isTokenExpired(token)) {
            let storedRole: UserRole[] | null = null;
            if (typeof window !== 'undefined') {
                const raw = localStorage.getItem('role');
                try {
                    const parsed = raw ? JSON.parse(raw) : null;
                    storedRole = Array.isArray(parsed)
                        ? parsed.filter((r) => validRoles.includes(r as UserRole))
                        : validRoles.includes(parsed as UserRole)
                            ? [parsed as UserRole]
                            : null;
                } catch {
                    storedRole = null;
                }
            }
            setRole(storedRole && storedRole.length > 0 ? storedRole : ['Guest']);
            setRoleLoading(false);
            return;
        }

        // If user is not loaded yet, wait
        if (!user) {
            return;
        }

        // If user is logged in, use user.roles
        if (Array.isArray(user.roles) && user.roles.length > 0) {
            const userRoles = user.roles.filter((r: string) =>
                validRoles.includes(r as UserRole)
            ) as UserRole[];
            setRole(userRoles.length > 0 ? userRoles : ['Student']);
        }
        setRoleLoading(false);
    }, [getToken, user]);

    return (
        <RoleContext.Provider value={{ role, setRole, getRole, roleLoading }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRoles = () => useContext(RoleContext);
