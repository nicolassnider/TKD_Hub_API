'use client';

// 1. External imports
import React, { createContext, useContext, useState, useEffect } from 'react';

// 2. App/context/component imports
import { isTokenExpired } from '../utils/auth';
import { useAuth } from './AuthContext';

export type UserRole = 'Guest' | 'Student' | 'Coach' | 'Admin';

type RoleContextType = {
	role: UserRole;
	setRole: (role: UserRole) => void;
	getRole: () => UserRole;
};

const RoleContext = createContext<RoleContextType>({
	role: 'Guest',
	setRole: () => { },
	getRole: () => 'Guest',
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// 1. Context hooks
	const { getToken, user } = useAuth();

	// 2. State hooks
	const [role, setRoleState] = useState<UserRole>('Guest');

	// 3. Functions
	const setRole = (newRole: UserRole) => {
		setRoleState(newRole);
		if (typeof window !== 'undefined') {
			if (newRole === 'Guest') {
				localStorage.removeItem('role');
			} else {
				localStorage.setItem('role', newRole);
			}
		}
	};

	const getRole = () => role;

	// 4. Effects
	useEffect(() => {
		// Sync role with AuthContext user and token
		const token = getToken();
		if (!token || isTokenExpired(token)) {
			setRole('Guest');
			return;
		}

		// If user exists and has roles, use the first valid role
		if (user && Array.isArray(user.roles) && user.roles.length > 0) {
			const validRoles: UserRole[] = ['Guest', 'Student', 'Coach', 'Admin'];
			const userRole = user.roles.find((r: string) => validRoles.includes(r as UserRole));
			setRole((userRole as UserRole) || 'Student');
		} else {
			// Fallback to localStorage or Guest
			const storedRole = (typeof window !== 'undefined' ? localStorage.getItem('role') : null) as UserRole | null;
			const validRoles: UserRole[] = ['Guest', 'Student', 'Coach', 'Admin'];
			setRole(storedRole && validRoles.includes(storedRole as UserRole) ? (storedRole as UserRole) : 'Guest');
		}
	}, [getToken, user]);

	// 5. Render
	return (
		<RoleContext.Provider value={{ role, setRole, getRole }}>
			{children}
		</RoleContext.Provider>
	);
};

export const useRoles = () => useContext(RoleContext);
