"use client";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) return <div className="p-8 text-center">Not logged in.</div>;

    return (
        <div className="max-w-xl mx-auto my-10 bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <div className="space-y-2">
                <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
                <div><strong>Email:</strong> {user.email}</div>
                {user.phoneNumber && <div><strong>Phone:</strong> {user.phoneNumber}</div>}
                {user.gender !== undefined && <div><strong>Gender:</strong> {user.gender}</div>}
                {user.dateOfBirth && <div><strong>Date of Birth:</strong> {user.dateOfBirth}</div>}
                {user.dojaangId && <div><strong>Dojaang ID:</strong> {user.dojaangId}</div>}
                {user.currentRankId && <div><strong>Current Rank ID:</strong> {user.currentRankId}</div>}
                {user.joinDate && <div><strong>Join Date:</strong> {user.joinDate}</div>}
                {user.roles && <div><strong>Roles:</strong> {user.roles.join(", ")}</div>}
                <div><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</div>
            </div>
        </div>
    );
}
