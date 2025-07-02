import React from "react";
import EditPromotionFormFields from "./EditPromotionFormFields";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import { Promotion } from "@/app/types/Promotion";
import { Student } from "@/app/types/Student";
import { Rank } from "@/app/types/Rank";
import { Coach } from "@/app/types/Coach";
import { Dojaang } from "@/app/types/Dojaang";

type EditPromotionFormProps = {
  form: Partial<Promotion>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Promotion>>>;
  originalForm: Partial<Promotion> | null;
  students: Student[];
  ranks: Rank[];
  coaches: Coach[];
  dojaangs: Dojaang[];
  loadingRanks: boolean;
  loadingDojaangs: boolean;
  saving: boolean;
  onClose: (refresh?: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  // Accepts only studentId, but we need to wrap it for the child
  getNextRankIdForStudent: (studentId: number) => number | undefined;
};

export default function EditPromotionForm({
  form,
  setForm,
  originalForm,
  students,
  ranks,
  coaches,
  dojaangs,
  loadingRanks,
  loadingDojaangs,
  saving,
  onClose,
  onSubmit,
  getNextRankIdForStudent,
}: EditPromotionFormProps) {
  // Wrapper to match the expected signature in EditPromotionFormFields
  const getNextRankIdForStudentWrapper = (studentId: number | undefined) => {
    if (typeof studentId !== "number") return undefined;
    return getNextRankIdForStudent(studentId);
  };

  return (
    <form className="flex-1 overflow-y-auto space-y-4" onSubmit={onSubmit}>
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
        getNextRankIdForStudent={getNextRankIdForStudentWrapper}
      />
      <div className="flex justify-end gap-2 pt-2">
        <FormActionButtons
          onCancel={() => onClose(false)}
          onSubmitLabel={
            form && form.id
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
  );
}
