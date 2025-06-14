"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PromotionTableRows from "@/app/components/promotions/PromotionsTableRows";
import EditPromotion from "@/app/components/promotions/EditPromotions";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import { useApiRequest } from "@/app/utils/api"; // <-- Use the hook, not direct import
import { Promotion } from "@/app/types/Promotion";
import StudentSelector from "@/app/components/students/StudentSelector";
import { Student } from "@/app/types/Student";
import { useAuth } from "../context/AuthContext";
import { AdminListPage } from "../components/AdminListPage";

export default function PromotionsAdminContent() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editId, setEditId] = useState<number | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const { getToken } = useAuth();
    const { baseUrl } = useApiConfig();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const { apiRequest } = useApiRequest(); // <-- Use the hook

    // Always use the query param as the source of truth
    const studentIdParam = searchParams.get("studentId");
    const studentIdFilter = studentIdParam && !isNaN(Number(studentIdParam)) ? Number(studentIdParam) : undefined;

    function handleClearStudent() {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("studentId");
        router.replace(`?${params.toString()}`, { scroll: false });
    }

    // Fetch students for selector
    useEffect(() => {
        apiRequest<{ data: { data: Student[] } }>(`${baseUrl}/Students`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(res => {
                const studentsRaw = res.data.data;
                // Add a 'name' property for selector display
                const mappedStudents = Array.isArray(studentsRaw)
                    ? studentsRaw.map(s => ({
                        ...s,
                        name: `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim()
                    }))
                    : [];
                setStudents(mappedStudents);
            })
            .catch(() => setStudents([]));
    }, [baseUrl, getToken, apiRequest]);

    // Fetch promotions whenever studentIdFilter changes
    const fetchPromotions = async (studentId?: number | null) => {
        setLoading(true);
        setError(null);
        try {
            let url = `${baseUrl}/Promotions`;
            if (studentId) {
                url += `?studentId=${studentId}`;
            }
            const data = await apiRequest<{ data: Promotion[] }>(url, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            // Sort promotions by date descending (latest first)
            const sortedPromotions = Array.isArray(data.data)
                ? [...data.data].sort(
                    (a, b) => new Date(b.promotionDate).getTime() - new Date(a.promotionDate).getTime()
                )
                : [];
            setPromotions(sortedPromotions);
        } catch {
            setError("Failed to load promotions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions(studentIdFilter);
        // eslint-disable-next-line
    }, [studentIdFilter, baseUrl]);

    // Handler for StudentSelector
    function handleStudentSelect(id: number | null) {
        if (id !== null) {
            router.replace(`?studentId=${id}`);
        } else {
            router.replace(`?`);
        }
    }

    function handleCreateClose(refresh?: boolean) {
        setShowCreate(false);
        if (refresh) {
            fetchPromotions(studentIdFilter);
            toast.success("Promotion created!");
        }
    }

    function handleEditClose(refresh?: boolean) {
        setEditId(null);
        if (refresh) {
            fetchPromotions(studentIdFilter);
            toast.success("Promotion updated!");
        }
    }

    async function handleDelete() {
        if (!deleteId) return;
        setLoading(true);
        try {
            await apiRequest(`${baseUrl}/Promotions/${deleteId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setDeleteId(null);
            fetchPromotions(studentIdFilter);
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
            filters={
                <div className="mb-4 flex items-center gap-2">
                    <div className="min-w-[220px]">
                        <StudentSelector
                            students={students}
                            value={studentIdFilter ?? null}
                            onChange={handleStudentSelect}
                        />
                    </div>
                    {studentIdFilter !== undefined && (
                        <button
                            type="button"
                            className="ml-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                            onClick={handleClearStudent}
                        >
                            Clear Student
                        </button>
                    )}
                </div>
            }
            modals={
                <>
                    {showCreate && (
                        <EditPromotion
                            onClose={handleCreateClose}
                            studentId={typeof studentIdFilter === "number" ? studentIdFilter : undefined}
                        />
                    )}
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
                                            type="button"
                                            className="w-full sm:w-auto px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                                            onClick={() => setDeleteId(null)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
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
