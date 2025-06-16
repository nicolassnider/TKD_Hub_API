'use client';

// 1. External imports
import { useEffect } from 'react';

// 2. App/context/component imports
import { useRoles } from '../../context/RoleContext';
import { useRouter } from 'next/navigation';

const allowedRoles = ['Admin']; // Set roles for this page

export default function UsersPage() {
	// 1. Context hooks
	const { role } = useRoles();
	const router = useRouter();

	// 2. State hooks
	// (No state hooks)

	// 3. Effects
	useEffect(() => {
		if (!allowedRoles.includes(role)) {
			router.replace('/forbidden');
		}
	}, [role, router]);

	// 4. Functions
	// (No local functions)

	// 5. Render
	// ...rest of your page
}
