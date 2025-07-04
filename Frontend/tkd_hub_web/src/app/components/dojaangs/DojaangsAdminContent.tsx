"use client";
import { useState } from "react";
import EditDojaang from "../../components/dojaangs/EditDojaang";
import { toast } from "react-hot-toast";
import { AdminListPage } from "../../components/AdminListPage";
import DojaangTableRows from "@/app/components/dojaangs/DojaangTableRows";
import { useDojaangs } from "@/app/context/DojaangContext";
import DojaangModalConfirmDelete from "./DojaangModalConfirmDelete";

export default function DojaangsAdminContent() {
  const { dojaangs, loading, error, fetchDojaangs, deleteDojaang } =
    useDojaangs();

  const [editId, setEditId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  function handleEditClose(wasUpdated?: boolean) {
    setEditId(null);
    fetchDojaangs();
    if (wasUpdated !== false) toast.success("Dojaang updated!");
  }

  function handleAddClose(wasCreated?: boolean) {
    setShowAdd(false);
    fetchDojaangs();
    if (wasCreated !== false) toast.success("Dojaang created!");
  }

  async function handleDelete(dojaangId: number) {
    setDeleteLoading(true);
    try {
      await deleteDojaang(dojaangId);
      toast.success("Dojaang deleted!");
      fetchDojaangs();
    } catch {
      toast.error("Failed to delete dojaang.");
    } finally {
      setDeleteLoading(false);
      setConfirmId(null);
    }
  }

  const filteredDojaangs = showInactive
    ? dojaangs
    : dojaangs.filter((d) => d.isActive !== false);

  return (
    <>
      <div className="flex items-center gap-4 mb-0 pl-4">
        <label
          htmlFor="showInactiveSwitch"
          className="font-medium text-neutral-200 flex items-center gap-4 cursor-pointer"
        >
          <span className="mr-4">Show inactive dojaangs</span>
          {/* ON/OFF Switch */}
          <span className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in mr-2">
            <input
              id="showInactiveSwitch"
              type="checkbox"
              checked={showInactive}
              onChange={() => setShowInactive((v) => !v)}
              className="sr-only peer"
            />
            <span className="block w-12 h-6 bg-neutral-700 rounded-full peer-checked:bg-blue-600 transition"></span>
            <span className="dot absolute left-1 top-1 bg-neutral-200 w-4 h-4 rounded-full transition peer-checked:translate-x-6 tkd-switch-dot"></span>
          </span>
          <span className="ml-2 text-sm text-neutral-400">
            {showInactive ? "All" : "Active"}
          </span>
        </label>
      </div>
      <AdminListPage
        title="Dojaangs Administration"
        onCreate={() => setShowAdd(true)}
        loading={loading}
        error={error}
        filters={null}
        modals={
          <>
            {showAdd && <EditDojaang dojaangId={0} onClose={handleAddClose} />}
            {editId !== null && (
              <EditDojaang dojaangId={editId} onClose={handleEditClose} />
            )}
            {confirmId !== null && (
              <DojaangModalConfirmDelete
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
          <DojaangTableRows
            dojaangs={filteredDojaangs}
            onEdit={setEditId}
            onRequestDelete={setConfirmId}
          />
        }
      />
    </>
  );
}
