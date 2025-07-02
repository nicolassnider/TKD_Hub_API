import React from "react";
import LabeledInput from "../common/inputs/LabeledInput";
import { GenericSelector } from "../common/selectors/GenericSelector";
import { Promotion } from "@/app/types/Promotion";
import { Student } from "@/app/types/Student";
import { Rank } from "@/app/types/Rank";
import { Coach } from "@/app/types/Coach";
import { Dojaang } from "@/app/types/Dojaang";

type Props = {
  form: Partial<Promotion>;
  setForm: React.Dispatch<React.SetStateAction<Partial<Promotion>>>;
  students: Student[];
  ranks: Rank[];
  coaches: Coach[];
  dojaangs: Dojaang[];
  loadingRanks: boolean;
  loadingDojaangs: boolean;
  saving: boolean;
  getNextRankIdForStudent: (
    studentId: number | undefined,
    students: Student[],
    ranks: Rank[]
  ) => number | undefined;
};

const EditPromotionFormFields: React.FC<Props> = ({
  form,
  setForm,
  students,
  ranks,
  coaches,
  dojaangs,
  loadingRanks,
  loadingDojaangs,
  saving,
  getNextRankIdForStudent,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Student selector */}
    <GenericSelector
      items={students}
      value={form.studentId ?? null}
      onChange={(id) => {
        const nextRankId = getNextRankIdForStudent(
          id ?? undefined,
          students,
          ranks
        );
        setForm((prev) => ({
          ...prev,
          studentId: id ?? undefined,
          rankId: nextRankId,
        }));
      }}
      getLabel={(s) =>
        `${s.firstName} ${s.lastName}${s.email ? ` (${s.email})` : ""}`
      }
      getId={(s) => s.id!}
      disabled={saving}
      required
      label="Student"
      placeholder="Select a student"
    />
    {/* Ranks selector */}
    <GenericSelector
      items={ranks}
      value={form.rankId ?? null}
      onChange={(id) =>
        setForm((prev) => ({
          ...prev,
          rankId: id ?? undefined,
        }))
      }
      getLabel={(r) => r.name}
      getId={(r) => r.id}
      disabled={saving || loadingRanks}
      required
      label="Rank"
      placeholder={loadingRanks ? "Loading ranks..." : "Select a rank"}
    />
    {/* Coach selector */}
    <GenericSelector
      items={coaches}
      value={form.coachId ?? null}
      onChange={(id) =>
        setForm((prev) => ({
          ...prev,
          coachId: id ?? undefined,
        }))
      }
      getLabel={(c) =>
        `${c.firstName} ${c.lastName}${c.email ? ` (${c.email})` : ""}`
      }
      getId={(c) => c.id}
      disabled={saving}
      required
      label="Coach"
      placeholder="Select a coach"
    />
    {/* Dojaang selector */}
    <GenericSelector
      items={dojaangs}
      value={form.dojaangId ?? null}
      onChange={(id) =>
        setForm((prev) => ({
          ...prev,
          dojaangId: id ?? undefined,
        }))
      }
      getLabel={(d) => d.name}
      getId={(d) => d.id}
      disabled={saving || loadingDojaangs}
      required
      label="Dojaang"
      placeholder="Select a dojaang"
    />
    {/* Promotion Date */}
    <LabeledInput
      label="Promotion Date"
      name="promotionDate"
      datepicker
      selectedDate={form.promotionDate ? new Date(form.promotionDate) : null}
      onDateChange={(date) =>
        setForm((prev) => ({
          ...prev,
          promotionDate: date ? date.toISOString().slice(0, 10) : "",
        }))
      }
      required
      disabled={saving}
      placeholder="YYYY-MM-DD"
    />
    {/* Notes */}
    <div className="col-span-1 md:col-span-2">
      <label htmlFor="notes" className="block mb-1 font-medium">
        Notes
      </label>
      <textarea
        id="notes"
        name="notes"
        value={form.notes ?? ""}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            notes: e.target.value,
          }))
        }
        placeholder="Notes"
        disabled={saving}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        rows={3}
      />
    </div>
  </div>
);

export default EditPromotionFormFields;
