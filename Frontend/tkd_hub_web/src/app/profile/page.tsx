"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useApiConfig } from "../context/ApiConfigContext";
import { apiRequest } from "../utils/api";
import { CoachClass } from "../types/CoachClass";
import ProfileInfo from "../components/profiles/ProfileInfo";
import CoachClasses from "../components/profiles/CoachClasses";

export default function ProfilePage() {
    const { user, getToken, loading: authLoading } = useAuth();
    const { baseUrl } = useApiConfig();
    const [coachClasses, setCoachClasses] = useState<CoachClass[] | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchCoachClasses = async () => {
            setLoading(true);
            try {
                const data = await apiRequest(
                    `${baseUrl}/Users/coach/classes`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${getToken()}`,
                        },
                    }
                );
                setCoachClasses(Array.isArray(data) ? data : []);
            } catch {
                setCoachClasses([]);
            } finally {
                setLoading(false);
            }
        };

        if (user?.roles?.includes("Coach")) {
            fetchCoachClasses();
        }
    }, [user, baseUrl, getToken]);

    if (authLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!user) {
        return <div className="p-8 text-center">Not logged in.</div>;
    }

    return (
        <div className="flex justify-center items-center my-10">
            <div className="w-full max-w-6xl bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-10 flex flex-col gap-10 mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 self-center">My Profile</h2>
                <ProfileInfo user={user} />
                {user.roles?.includes("Coach") && (
                    <CoachClasses loading={loading} coachClasses={coachClasses} />
                )}
            </div>
        </div>
    );
}
