import React, { useState, useEffect } from "react";
import LabeledInput from "@/app/components/common/inputs/LabeledInput";
import { GenericSelector } from "@/app/components/common/selectors/GenericSelector";
import ModalCloseButton from "@/app/components/common/actionButtons/ModalCloseButton";
import FormActionButtons from "@/app/components/common/actionButtons/FormActionButtons";

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
    const selected = roles.find(r => r.id === id);
    setUser({ ...user, role: selected ? selected.value : "" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Replace with real save logic
    setTimeout(() => {
      setLoading(false);
      onClose(true);
    }, 500);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded shadow-lg min-w-[320px]">
        <ModalCloseButton onClick={() => onClose()} disabled={loading} />
        <h2 className="text-lg font-bold mb-4">{userId ? "Edit User" : "Add User"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput
            label="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <LabeledInput
            label="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <GenericSelector
            items={roles}
            value={roles.find(r => r.value === user.role)?.id ?? null}
            onChange={handleRoleChange}
            getLabel={r => r.label}
            getId={r => r.id}
            label="Role"
            required
            disabled={loading}
            placeholder="Select role"
          />
          <FormActionButtons
            onCancel={() => onClose()}
            onSubmitLabel={userId ? "Save" : "Create"}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
}
