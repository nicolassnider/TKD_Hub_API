import React from "react";
import { Student } from "@/app/types/Student";
import LabeledInput from "../common/inputs/LabeledInput";
import { GenericSelector } from "../common/selectors/GenericSelector";
import { Gender } from "@/app/enums/Gender";
import GenderSelector from "../common/selectors/GenderSelector";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import equal from "fast-deep-equal";
import { Rank } from "@/app/types/Rank";
import { Dojaang } from "@/app/types/Dojaang";


type EditStudentFormProps = {
  form: Omit<Student, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Student, "id"> | null>>;
  originalForm: Omit<Student, "id"> | null;
  isBlackBelt: boolean;
  setIsBlackBelt: React.Dispatch<React.SetStateAction<boolean>>;
  ranks: Rank[];
  ranksLoading: boolean;
  dojaangs: Dojaang[];
  dojaangsLoading: boolean;
  saving: boolean;
  onSubmit: (form: Omit<Student, "id">) => void;
  onCancel: () => void;
};


const EditStudentForm: React.FC<EditStudentFormProps> = ({
  form,
  setForm,
  originalForm,
  isBlackBelt,
  setIsBlackBelt,
  ranks,
  ranksLoading,
  dojaangs,
  dojaangsLoading,
  saving,
  onSubmit,
  onCancel,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev!,
      [name]: name === "gender" ? Number(value) : value,
    }));
  };


  const handleDojaangChange = (id: number | null) => {
    setForm((prev) => ({
      ...prev!,
      dojaangId: id ?? undefined,
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };


  return (
    <form
      className="flex-1 overflow-y-auto pr-2 space-y-4"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LabeledInput
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          disabled={saving}
          required
        />
        <LabeledInput
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          disabled={saving}
          required
        />
        <LabeledInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          disabled={saving}
          placeholder="Enter email address"
          required
        />
        <LabeledInput
          label="Phone Number"
          name="phoneNumber"
          value={typeof form.phoneNumber === "string" ? form.phoneNumber : ""}
          onChange={handleChange}
          disabled={saving}
          placeholder="e.g. 11-2345-6789"
          required
        />
        <GenderSelector
          value={form.gender ?? null}
          onChange={(id) =>
            setForm((prev) => ({
              ...prev!,
              gender: id ?? Gender.MALE,
            }))
          }
          disabled={saving}
          required
          className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        <LabeledInput
          label="Date of Birth"
          name="dateOfBirth"
          datepicker
          selectedDate={form.dateOfBirth ? new Date(form.dateOfBirth) : null}
          onDateChange={(date) =>
            setForm((prev) => ({
              ...prev!,
              dateOfBirth: date ? date.toISOString().slice(0, 10) : "",
            }))
          }
          required
          disabled={saving}
          maxDate={new Date()}
          className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex-1">
          <GenericSelector
            items={ranks}
            value={form.currentRankId ?? null}
            onChange={(id) =>
              setForm((prev) => ({
                ...prev!,
                currentRankId: id ?? null,
              }))
            }
            getLabel={(r) => r.name}
            getId={(r) => r.id}
            filter={(r) =>
              isBlackBelt ? r.danLevel !== null : r.danLevel === null
            }
            disabled={saving || ranksLoading}
            required
            label="Rank"
            placeholder="Select a rank"
            className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              id="isBlackBelt"
              type="checkbox"
              checked={isBlackBelt}
              onChange={(e) => setIsBlackBelt(e.target.checked)}
              disabled={saving || ranksLoading}
              className="accent-black w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="isBlackBelt"
              className="font-medium select-none cursor-pointer mb-0"
            >
              Is Black Belt?
            </label>
          </div>
        </div>
        <GenericSelector
          items={dojaangs}
          value={form.dojaangId ?? null}
          onChange={handleDojaangChange}
          getLabel={(d) => d.name}
          getId={(d) => d.id}
          disabled={saving || dojaangsLoading}
          required
          label="Dojaang"
          id="dojaang-selector"
          placeholder="Select a dojaang"
          className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <FormActionButtons
        onCancel={onCancel}
        onSubmitLabel={form ? "Update" : "Create"}
        loading={saving}
        disabled={equal(form, originalForm)}
      />
    </form>
  );
};


export default EditStudentForm;