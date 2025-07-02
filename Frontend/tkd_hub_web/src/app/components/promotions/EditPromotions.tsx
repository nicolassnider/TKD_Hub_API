"use client";
import React, { useEffect, useState } from "react";
import { usePromotions } from "@/app/context/PromotionContext";
import { Promotion } from "@/app/types/Promotion";
import { CreatePromotionDto } from "@/app/types/CreatePromotionDto";
import { useStudents } from "@/app/context/StudentContext";
import toast from "react-hot-toast";
import { useCoaches } from "@/app/context/CoachContext";
import { useRanks } from "@/app/context/RankContext";
import { useDojaangs } from "@/app/context/DojaangContext";
import { EditModal } from "../common/modals/EditModal";
import EditPromotionForm from "./EditPromotionForm";
import { Student } from "@/app/types/Student";
import { Rank } from "@/app/types/Rank";

type EditPromotionProps = {
  promotion?: Promotion;
  onClose: (refresh?: boolean) => void;
  studentId?: number;
};

const EditPromotion: React.FC<EditPromotionProps> = ({
  promotion,
  onClose,
  studentId,
}) => {
  const {
    createPromotion,
    updatePromotion,
    fetchPromotions,
    loading: loadingPromotions,
  } = usePromotions();
  const { students, loading: loadingStudents } = useStudents();
  const { coaches, fetchCoaches, loading: loadingCoaches } = useCoaches();
  const { ranks, fetchRanks, loading: loadingRanks } = useRanks();
  const { dojaangs, loading: loadingDojaangs } = useDojaangs();

  const [form, setForm] = useState<Partial<Promotion>>(
    promotion
      ? { ...promotion }
      : {
          studentId: studentId,
          rankId: undefined,
          promotionDate: "",
          notes: "",
        }
  );
  const [originalForm, setOriginalForm] = useState<Partial<Promotion> | null>(
    promotion ? { ...promotion } : null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoaches();
    fetchRanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (promotion) {
      setForm({ ...promotion });
      setOriginalForm({ ...promotion });
    } else {
      setForm({
        studentId: studentId,
        rankId: undefined,
        promotionDate: "",
        notes: "",
      });
      setOriginalForm(null);
    }
  }, [promotion, studentId]);

  // Helper: get next rank id for a student
  const getNextRankIdForStudent = (studentId: number) => {
    const student: Student | undefined = students.find(
      (s) => s.id === studentId
    );
    if (!student) return undefined;
    const currentRankIndex = ranks.findIndex(
      (r: Rank) => r.id === student.currentRankId
    );
    if (currentRankIndex === -1 || currentRankIndex + 1 >= ranks.length)
      return undefined;
    return ranks[currentRankIndex + 1]?.id;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (promotion && promotion.id) {
        await updatePromotion(promotion.id, form);
      } else {
        const createData: CreatePromotionDto = {
          studentId: Number(form.studentId),
          rankId: Number(form.rankId),
          promotionDate: form.promotionDate ?? "",
          coachId: Number(form.coachId),
          notes: form.notes,
          dojaangId: Number(form.dojaangId),
        };
        await createPromotion(createData);
      }
      await fetchPromotions();
      setSaving(false);
      onClose(true);
    } catch (err: unknown) {
      setSaving(false);
      if (err instanceof Error) setError(err.message);
      else setError("Failed to save promotion");
      toast.error("Failed to save promotion");
    }
  }

  if (loadingPromotions || loadingStudents || loadingCoaches) {
    return (
      <div className="flex-1 flex items-center justify-center text-lg text-blue-600">
        Loading...
      </div>
    );
  }
  if (error)
    return <div className="text-red-600 text-center mb-2">{error}</div>;

  return (
    <EditModal
      open={true}
      title={promotion ? "Edit Promotion" : "Create Promotion"}
      saving={saving}
      onClose={onClose}
    >
      <EditPromotionForm
        form={form}
        setForm={setForm}
        originalForm={originalForm}
        students={students}
        ranks={ranks}
        coaches={coaches}
        dojaangs={dojaangs}
        loadingRanks={loadingRanks}
        loadingDojaangs={loadingDojaangs}
        saving={saving}
        onClose={onClose}
        onSubmit={handleSubmit}
        getNextRankIdForStudent={getNextRankIdForStudent}
      />
    </EditModal>
  );
};

export default EditPromotion;
