import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import { Promotion } from "@/app/types/Promotion";
import { useStudents } from "@/app/context/StudentContext";
import { usePromotions } from "@/app/context/PromotionContext";
import { AdminListPage } from "../AdminListPage";

export function usePromotionsAdmin() {
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const { baseUrl } = useApiConfig();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { students, fetchStudents } = useStudents();
  const {
    promotions,
    loading,
    error,
    fetchPromotions,
    deletePromotion,
    fetchPromotionsByStudentId,
  } = usePromotions();

  const studentIdParam = searchParams.get('studentId');
  const studentIdFilter =
    studentIdParam && !isNaN(Number(studentIdParam))
      ? Number(studentIdParam)
      : undefined;

  useEffect(() => {
    if (students.length === 0) {
      fetchStudents?.();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (studentIdFilter !== undefined) {
      fetchPromotionsByStudentId(studentIdFilter);
    } else {
      fetchPromotions();
    }
    // eslint-disable-next-line
  }, [studentIdFilter, baseUrl]);

  function handleClearStudent() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('studentId');
    router.replace(`?${params.toString()}`, { scroll: false });
  }

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
      if (studentIdFilter !== undefined) {
        fetchPromotionsByStudentId(studentIdFilter);
      } else {
        fetchPromotions();
      }
      toast.success('Promotion created!');
    }
  }

  function handleEdit(promotion: Promotion) {
    setEditingPromotion(promotion);
  }

  function handleEditClose() {
    setEditingPromotion(null);
  }

  function handleDeletePrompt(id: number) {
    setDeleteId(id);
  }

  function handleCancelDelete() {
    setDeleteId(null);
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deletePromotion(deleteId);
      setDeleteId(null);
      if (studentIdFilter !== undefined) {
        await fetchPromotionsByStudentId(studentIdFilter);
      } else {
        await fetchPromotions();
      }
      toast.success('Promotion deleted!');
    } catch {
      toast.error('Failed to delete promotion');
    }
  }

  return {
    AdminListPage,
    showCreate,
    setShowCreate,
    deleteId,
    setDeleteId,
    editingPromotion,
    setEditingPromotion,
    students,
    promotions,
    loading,
    error,
    studentIdFilter,
    handleClearStudent,
    handleStudentSelect,
    handleCreateClose,
    handleEdit,
    handleEditClose,
    handleDeletePrompt,
    handleDelete,
    handleCancelDelete,
  };
}
