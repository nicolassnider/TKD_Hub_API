import React, { useState, useEffect } from "react";
import EditUserForm from "./EditUserForm";
import { EditModal } from "@/app/components/common/modals/EditModal";

type EditUserProps = {
  userId?: number;
  onClose: (refreshList?: boolean) => void;
};

export default function EditUser({ userId, onClose }: EditUserProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{
    id?: number;
    name: string;
    email: string;
    role: string;
  }>({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (userId) {
      setLoading(true);
      // Replace with real fetch
      setTimeout(() => {
        setUser({
          id: userId,
          name: "Sample User",
          email: "user@example.com",
          role: "User",
        });
        setLoading(false);
      }, 500);
    } else {
      setUser({ name: "", email: "", role: "" });
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center">Loading user...</div>;
  }

  return (
    <EditModal
      open={true}
      title={userId ? "Edit User" : "Add User"}
      saving={false}
      onClose={onClose}
    >
      <EditUserForm
        user={user}
        setUser={setUser}
        userId={userId}
        onClose={onClose}
      />
    </EditModal>
  );
}
