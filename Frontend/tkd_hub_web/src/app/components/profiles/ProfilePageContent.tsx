"use client";

import { useAuth } from "@/app/context/AuthContext";
import ProfilePageMainCard from "./ProfilePageMainCard";

export default function ProfilePageContent() {
  // 1. Context hooks
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Not logged in.</div>;
  }

  return (
    <div className="flex justify-center items-center my-10">
      <ProfilePageMainCard user={user} />
    </div>
  );
}
