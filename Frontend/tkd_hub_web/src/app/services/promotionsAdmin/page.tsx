"use client";
import { useEffect, useState } from "react";
import { AdminListPage } from "../../components/AdminListPage";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import PromotionTableRows from "@/app/components/promotions/PromotionsTableRows";
import EditPromotion from "@/app/components/promotions/EditPromotions";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import { apiRequest } from "@/app/utils/api";
import { Promotion } from "@/app/types/Promotion";

export default function PromotionsAdmin() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { getToken } = useAuth();
  const { baseUrl } = useApiConfig();

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<{ data: Promotion[] }>(`${baseUrl}/Promotions`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPromotions(Array.isArray(data.data) ? data.data : []);
    } catch {
      setError("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
    // eslint-disable-next-line
  }, []);

  function handleEditClose(refresh?: boolean) {
    setEditId(null);
    if (refresh) {
      fetchPromotions();
      toast.success("Promotion updated!");
    }
  }

  function handleCreateClose(refresh?: boolean) {
    setShowCreate(false);
    if (refresh) {
      fetchPromotions();
      toast.success("Promotion created!");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    try {
      await fetch(`${baseUrl}/Promotions/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setDeleteId(null);
      fetchPromotions();
      toast.success("Promotion deleted!");
    } catch {
      setError("Failed to delete promotion");
      setLoading(false);
    }
  }

  return (
    <AdminListPage
      title="Promotions Administration"
      loading={loading}
      error={error}
      onCreate={() => setShowCreate(true)}
      createLabel="Add Promotion"
      tableHead={
        <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Promoted To</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Options</th>
        </tr>
      }
      tableBody={
        <PromotionTableRows
          promotions={promotions}
          onEdit={setEditId}
          onDelete={setDeleteId}
        />
      }
      modals={
        <>
          {showCreate && <EditPromotion onClose={handleCreateClose} />}
          {editId !== null && (
            <EditPromotion promotionId={editId} onClose={handleEditClose} />
          )}
          {deleteId !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div className="flex justify-between items-center border-b px-4 sm:px-6 py-4">
                  <h3 className="text-lg font-semibold">Confirm Delete</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                    aria-label="Close"
                    onClick={() => setDeleteId(null)}
                    disabled={loading}
                  >
                    &times;
                  </button>
                </div>
                <div className="px-4 sm:px-6 py-4">
                  <p className="mb-4">Are you sure you want to delete this promotion?</p>
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                      className="w-full sm:w-auto px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                      onClick={() => setDeleteId(null)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="w-full sm:w-auto px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      }
    />
  );
}
