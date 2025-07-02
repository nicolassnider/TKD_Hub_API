import React, { useState } from "react";
import LabeledInput from "@/app/components/common/inputs/LabeledInput";
import { GenericSelector } from "@/app/components/common/selectors/GenericSelector";
import FormActionButtons from "@/app/components/common/actionButtons/FormActionButtons";

const roles = [
  { id: 1, value: "Admin", label: "Admin" },
  { id: 2, value: "User", label: "User" },
];

type User = {
  id?: number;
  name: string;
  email: string;
  role: string;
};

type EditUserFormProps = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  userId?: number;
  onClose: (refreshList?: boolean) => void;
};

export default function EditUserForm({
  user,
  setUser,
  userId,
  onClose,
}: EditUserFormProps) {
  const [saving, setSaving] = useState(false);

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

  return (
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
  );
}
