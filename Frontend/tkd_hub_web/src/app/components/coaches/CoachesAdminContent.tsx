"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CoachesTableRows from "../../components/coaches/CoachesTableRows";
import EditCoach from "../../components/coaches/EditCoach";
import { AdminListPage } from "../../components/AdminListPage";
import { useUsers } from "@/app/context/UserContext";
import { useCoaches } from "@/app/context/CoachContext";
import CoachModalConfirmDelete from "./CoachModalConfirmDelete";

export default function CoachesAdminContent() {
  // 1. Context hooks
  const { reactivateUser } = useUsers();
  const { coaches, loading, error, fetchCoaches, deleteCoach } = useCoaches();

  // 2. State hooks
  const [editId, setEditId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // 3. Effects
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, []);

  // 4. Functions
  const handleRefresh = () => {
    fetchCoaches();
  };

  const handleReactivate = async (coachId: number) => {
    try {
      await reactivateUser(coachId);
      toast.success("Coach reactivated!");
      handleRefresh();
    } catch {
      toast.error("Failed to reactivate coach.");
    }
  };

  function handleEditClose(wasUpdated?: boolean) {
    setEditId(null);
    if (wasUpdated) handleRefresh();
  }

  function handleAddClose(wasCreated?: boolean) {
    setShowAdd(false);
    if (wasCreated) toast.success("Coach created!");
    handleRefresh();
  }

  async function handleDelete(coachId: number) {
    setDeleteLoading(true);
    try {
      await deleteCoach(coachId);
      toast.success("Coach deleted (soft delete)!");
      handleRefresh();
    } catch {
      toast.error("Failed to delete coach.");
    } finally {
      setDeleteLoading(false);
      setConfirmId(null);
    }
  }

  // Only filter here, don't pass showAll to CoachesTableRows
  const filteredCoaches = showAll
    ? coaches
    : coaches.filter((coach) => coach.isActive !== false);

  // 5. Render
  return (
    <>
      <div className="flex items-center gap-4 mb-0 pl-4">
        <label
          htmlFor="showAllSwitch"
          className="font-medium text-neutral-200 flex items-center gap-4 cursor-pointer"
        >
          <span className="mr-4">Show inactive coaches</span>
          {/* ON/OFF Switch */}
          <span className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in mr-2">
            <input
              id="showAllSwitch"
              type="checkbox"
              checked={showAll}
              onChange={() => setShowAll((v) => !v)}
              className="sr-only peer"
            />
            <span className="block w-12 h-6 bg-neutral-700 rounded-full peer-checked:bg-blue-600 transition"></span>
            <span className="dot absolute left-1 top-1 bg-neutral-200 w-4 h-4 rounded-full transition peer-checked:translate-x-6 tkd-switch-dot"></span>
          </span>
          <span className="ml-2 text-sm text-neutral-400">
            {showAll ? "All" : "Active"}
          </span>
        </label>
      </div>
      <AdminListPage
        title="Coaches Administration"
        onCreate={() => setShowAdd(true)}
        loading={loading}
        error={error}
        modals={
          <>
            {showAdd && (
              <EditCoach
                coachId={0}
                onClose={handleAddClose}
                handleRefresh={handleRefresh}
              />
            )}
            {editId !== null && (
              <EditCoach
                coachId={editId}
                onClose={handleEditClose}
                handleRefresh={handleRefresh}
              />
            )}
            {confirmId !== null && (
              <CoachModalConfirmDelete
                loading={deleteLoading}
                onCancel={() => setConfirmId(null)}
                onConfirm={() => handleDelete(confirmId)}
              />
            )}
          </>
        }
        tableHead={
          <tr className="bg-neutral-800">
            <th className="px-4 py-2 text-left font-semibold text-neutral-100">
              ID
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-100">
              Name
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-100">
              Email
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-100">
              Options
            </th>
          </tr>
        }
        tableBody={
          <CoachesTableRows
            coaches={filteredCoaches}
            onEdit={setEditId}
            onRequestDelete={setConfirmId}
            onReactivate={handleReactivate}
            isActiveFilter={showAll ? null : true}
          />
        }
      />
    </>
  );
}
