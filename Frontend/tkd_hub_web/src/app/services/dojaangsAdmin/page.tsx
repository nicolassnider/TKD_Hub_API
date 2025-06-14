"use client";
import { useState } from "react";
import EditDojaang from "../../components/dojaangs/EditDojaang";
import { toast } from "react-hot-toast";
import { AdminListPage } from "../../components/AdminListPage";
import DojaangTableRows from "@/app/components/dojaangs/DojaangTableRows";
import { useDojaangs } from "@/app/context/DojaangContext";

const ModalConfirmDelete: React.FC<{
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ loading, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded shadow-lg p-6 w-full max-w-xs">
      <h3 className="text-lg font-semibold mb-4 text-center">Confirm Delete</h3>
      <p className="mb-6 text-center">Are you sure you want to delete this dojaang?</p>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

export default function DojaangsAdmin() {
  const {
    dojaangs,
    loading,
    error,
    fetchDojaangs,
    deleteDojaang,
  } = useDojaangs();

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
          className="font-medium text-gray-700 flex items-center gap-4 cursor-pointer"
        >
          <span className="mr-4">
            Show inactive dojaangs
          </span>
          {/* ON/OFF Switch */}
          <span className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in mr-2">
            <input
              id="showInactiveSwitch"
              type="checkbox"
              checked={showInactive}
              onChange={() => setShowInactive((v) => !v)}
              className="sr-only peer"
            />
            <span className="block w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition"></span>
            <span
              className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-6 tkd-switch-dot"
            ></span>
          </span>
          <span className="ml-2 text-sm text-gray-500">
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
            {showAdd && (
              <EditDojaang
                dojaangId={0}
                onClose={handleAddClose}
              />
            )}
            {editId !== null && (
              <EditDojaang
                dojaangId={editId}
                onClose={handleEditClose}
              />
            )}
            {confirmId !== null && (
              <ModalConfirmDelete
                loading={deleteLoading}
                onCancel={() => setConfirmId(null)}
                onConfirm={() => handleDelete(confirmId)}
              />
            )}
          </>
        }
        tableHead={
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Options</th>
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
