'use client';

// 1. External imports
import { useEffect, useState } from 'react';

// 2. App/context/component imports
import { useAuth } from '../context/AuthContext';
import { useClasses } from '../context/ClassContext';
import ProfileInfo from '../components/profiles/ProfileInfo';
import CoachClasses from '../components/profiles/CoachClasses';
import TodaysClassesFloating from '../components/classes/TodaysClassesFloating';
import type { TrainingClass } from '../types/TrainingClass';

export default function ProfilePage() {
	// 1. Context hooks
	const { user, loading: authLoading } = useAuth();
	const { loading, getClassesByCoachId } = useClasses();

	// 2. State hooks
	const [coachClasses, setCoachClasses] = useState<TrainingClass[]>([]);

	// 3. Effects
	useEffect(() => {
		// Only fetch if user is a Coach and has an id
		if (user?.roles?.includes('Coach') && user.id) {
			getClassesByCoachId(user.id).then(setCoachClasses);
		} else {
			setCoachClasses([]);
		}
	}, [user?.id, user?.roles, getClassesByCoachId]);

	// 4. Functions
	// (No custom functions needed)

	// 5. Render
	if (authLoading) {
		return <div className="p-8 text-center">Loading...</div>;
	}

	if (!user) {
		return <div className="p-8 text-center">Not logged in.</div>;
	}

	return (
		<div className="flex justify-center items-center my-10">
			<div className="w-full max-w-6xl bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-10 flex flex-col gap-10 mx-auto text-center">
				<h2 className="text-3xl font-bold mb-4 self-center">
					My Profile
				</h2>
				<ProfileInfo user={user} />
				{user.roles?.includes('Coach') && (
					<CoachClasses
						loading={loading}
						coachClasses={coachClasses}
					/>
				)}
			</div>
			<TodaysClassesFloating />
		</div>
	);
}
