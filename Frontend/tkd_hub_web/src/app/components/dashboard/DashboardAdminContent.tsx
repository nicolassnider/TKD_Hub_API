"use client";
import React, { useState } from "react";
import { useDashboards } from "@/app/context/DashboardContext";
import DashboardWidgets from "@/app/components/dashboard/DashboardWidgets";
import GenericButton from "../common/actionButtons/GenericButton";

const DashboardAdminContent = () => {
  // 1. Context hooks
  const { createDashboard, loading, error } = useDashboards();

  // 2. State hooks
  const [userRole, setUserRole] = useState("Coach");
  const [widgets, setWidgets] = useState<string[]>([
    "ActiveMembers",
    "Revenue",
  ]);
  const [response, setResponse] = useState<{
    data: Record<string, unknown>;
  } | null>(null);

  // 3. Functions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createDashboard({ userRole, widgets });
    setResponse(result);
  };

  // 4. Render
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin Service</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="User Role"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Widgets (comma separated)"
          value={widgets.join(",")}
          onChange={(e) =>
            setWidgets(e.target.value.split(",").map((w) => w.trim()))
          }
        />
        <GenericButton type="submit" variant="primary" disabled={loading}>
          {loading ? "Creating..." : "Create Dashboard"}
        </GenericButton>
      </form>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {response && (
        <div className="mt-4">
          <DashboardWidgets data={response.data} />
        </div>
      )}
    </div>
  );
};

export default DashboardAdminContent;
