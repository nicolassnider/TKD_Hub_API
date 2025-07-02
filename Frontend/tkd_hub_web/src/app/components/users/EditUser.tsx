import React, { useState, useEffect } from "react";
import LabeledInput from "@/app/components/common/inputs/LabeledInput";
import { GenericSelector } from "@/app/components/common/selectors/GenericSelector";
import FormActionButtons from "@/app/components/common/actionButtons/FormActionButtons";
import { EditModal } from "@/app/components/common/modals/EditModal";

type EditUserProps = {
  userId?: number;
  onClose: (refreshList?: boolean) => void;
};

type User = {
  id?: number;
  name: string;
  email: string;
  role: string;
};

const defaultUser: User = {
  name: "",
  email: "",
  role: "",
};

const roles = [
  { id: 1, value: "Admin", label: "Admin" },
  { id: 2, value: "User", label: "User" },
];

export default function EditUser({ userId, onClose }: EditUserProps) {
  const [user, setUser] = useState<User>(defaultUser);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
      setUser(defaultUser);
    }
  }, [userId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleRoleChange(id: number | null) {
    const selected = roles.find((r) => r.id === id);
    setUser({ ...user, role: selected ? selected.value : "" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Replace with real save logic
    setTimeout(() => {
      setSaving(false);
      onClose(true);
    }, 500);
  }

  if (loading) {
    return <div className="text-center">Loading user...</div>;
  }

  return (
    <EditModal
      open={true}
      title={userId ? "Edit User" : "Add User"}
      saving={saving}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <LabeledInput
          label="Name"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
          disabled={saving}
        />
        <LabeledInput
          label="Email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
          required
          disabled={saving}
        />
        <GenericSelector
          items={roles}
          value={roles.find((r) => r.value === user.role)?.id ?? null}
          onChange={handleRoleChange}
          getLabel={(r) => r.label}
          getId={(r) => r.id}
          label="Role"
          required
          disabled={saving}
          placeholder="Select role"
        />
        <FormActionButtons
          onCancel={() => onClose()}
          onSubmitLabel={userId ? "Save" : "Create"}
          loading={saving}
        />
      </form>
    </EditModal>
  );
}
