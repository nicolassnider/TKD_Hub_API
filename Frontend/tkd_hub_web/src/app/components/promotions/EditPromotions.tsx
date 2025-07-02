"use client";
import React, { useEffect, useState } from "react";
import { usePromotions } from "@/app/context/PromotionContext";
import { Promotion } from "@/app/types/Promotion";
import { CreatePromotionDto } from "@/app/types/CreatePromotionDto";
import { useStudents } from "@/app/context/StudentContext";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import toast from "react-hot-toast";
import { useCoaches } from "@/app/context/CoachContext";
import { useRanks } from "@/app/context/RankContext";
import { useDojaangs } from "@/app/context/DojaangContext";
import { EditModal } from "../common/modals/EditModal";
import EditPromotionFormFields from "./EditPromotionFormFields";
import { Student } from "@/app/types/Student";
import { Rank } from "@/app/types/Rank";

type EditPromotionProps = {
  promotion?: Promotion;
  onClose: (refresh?: boolean) => void;
  studentId?: number;
};

const getNextRankIdForStudent = (
  studentId: number | undefined,
  students: Student[],
  ranks: Rank[]
): number | undefined => {
  if (!studentId || !ranks?.length) return undefined;
  const student = students.find((s) => s.id === studentId);
  const currentRankId = student?.currentRankId;
  if (!currentRankId) return ranks[0]?.id;
  const currentIndex = ranks.findIndex(
    (r: { id: number }) => r.id === currentRankId
  );
  if (currentIndex === -1 || currentIndex === ranks.length - 1)
    return currentRankId;
  return ranks[currentIndex + 1]?.id;
};

const EditPromotion: React.FC<EditPromotionProps> = ({
  promotion,
  onClose,
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
          studentId: undefined,
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
        studentId: undefined,
        rankId: undefined,
        promotionDate: "",
        notes: "",
      });
      setOriginalForm(null);
    }
  }, [promotion]);

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
      <form
        className="flex-1 overflow-y-auto space-y-4"
        onSubmit={handleSubmit}
      >
        <EditPromotionFormFields
          form={form}
          setForm={setForm}
          students={students}
          ranks={ranks}
          coaches={coaches}
          dojaangs={dojaangs}
          loadingRanks={loadingRanks}
          loadingDojaangs={loadingDojaangs}
          saving={saving}
          getNextRankIdForStudent={getNextRankIdForStudent}
        />
        <div className="flex justify-end gap-2 pt-2">
          <FormActionButtons
            onCancel={() => onClose(false)}
            onSubmitLabel={
              promotion
                ? saving
                  ? "Saving..."
                  : "Save"
                : saving
                ? "Creating..."
                : "Create"
            }
            loading={saving}
            disabled={JSON.stringify(form) === JSON.stringify(originalForm)}
          />
        </div>
      </form>
    </EditModal>
  );
};

export default EditPromotion;
