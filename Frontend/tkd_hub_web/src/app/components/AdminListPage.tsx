import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface AdminListPageProps {
  title: string;
  role?: string;
  canCreate?: boolean;
  onCreateClick?: () => void;
  loading?: boolean;
  error?: string | null;
  children?: ReactNode;
  createModal?: ReactNode;
  editModal?: ReactNode;
  deleteModal?: ReactNode;
}

export function AdminListPage({
  title,
  role,
  canCreate,
  onCreateClick,
  loading,
  error,
  children, // table
  createModal,
  editModal,
  deleteModal,
}: AdminListPageProps) {
  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-white rounded-lg shadow-lg p-4 sm:p-8">
      <Toaster position="top-right" />
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900">{title}</h2>
      <div className="mb-4 text-sm text-gray-600 text-center">
        Current role: <span className="font-semibold">{role ?? "None"}</span>
      </div>
      {canCreate && (
        <div className="mb-6 flex justify-center">
          <button
            className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={onCreateClick}
          >
            Add New
          </button>
        </div>
      )}
      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}
      {children}
      {createModal}
      {editModal}
      {deleteModal}
    </div>
  );
}
