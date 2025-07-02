import React from "react";
import LabeledInput from "../common/inputs/LabeledInput";
import GenderSelector from "../common/selectors/GenderSelector";
import { GenericSelector } from "../common/selectors/GenericSelector";
import { parseISO, isValid, subYears } from "date-fns";
import { Coach } from "@/app/types/Coach"; // Adjust path if needed

type CoachForm = Omit<Coach, "id">;

type Props = {
  form: CoachForm;
  setForm: React.Dispatch<React.SetStateAction<CoachForm | null>>;
  ranks: { id: number; name: string; danLevel: number | null }[];
  ranksLoading: boolean;
  loading: boolean;
  saving: boolean;
};

const EditCoachFormFields: React.FC<Props> = ({
  form,
  setForm,
  ranks,
  ranksLoading,
  loading,
  saving,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "gender" ? Number(value) : value,
          }
        : prev
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <LabeledInput
        label="First Name"
        name="firstName"
        placeholder="Enter first name"
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
        type="tel"
        value={form.phoneNumber || ""}
        onChange={handleChange}
        disabled={saving}
        placeholder="Enter phone number"
        required
      />
      <GenderSelector
        value={form.gender ?? null}
        onChange={(id) =>
          setForm((prev) =>
            prev
              ? {
                  ...prev,
                  gender: typeof id === "number" ? id : undefined,
                }
              : prev
          )
        }
        disabled={loading}
        required
        className="px-3 py-2"
      />
      <LabeledInput
        label="Date of Birth"
        name="dateOfBirth"
        datepicker
        selectedDate={
          form.dateOfBirth && isValid(parseISO(form.dateOfBirth))
            ? parseISO(form.dateOfBirth)
            : null
        }
        onDateChange={(date) =>
          setForm((prev) =>
            prev
              ? {
                  ...prev,
                  dateOfBirth: date ? date.toISOString().split("T")[0] : "",
                }
              : prev
          )
        }
        disabled={saving}
        maxDate={subYears(new Date(), 12)}
        required
        errorMessage="Date of birth is required"
      />
      <GenericSelector
        items={ranks}
        value={form.currentRankId ?? null}
        onChange={(id) =>
          setForm((prev) =>
            prev
              ? {
                  ...prev,
                  currentRankId: id ?? undefined,
                }
              : prev
          )
        }
        getLabel={(r) => r.name}
        getId={(r) => r.id}
        filter={(r) => r.danLevel !== null}
        disabled={loading || ranksLoading}
        required
        label="Rank"
        placeholder="Select a black belt rank"
        className="form-input px-3 py-2 border border-gray-300 rounded w-full"
        errorMessage="Rank is required"
      />
      <LabeledInput
        label="Join Date"
        name="joinDate"
        datepicker
        selectedDate={
          form.joinDate && isValid(parseISO(form.joinDate))
            ? parseISO(form.joinDate)
            : new Date()
        }
        onDateChange={(date) =>
          setForm((prev) =>
            prev
              ? {
                  ...prev,
                  joinDate: date ? date.toISOString().split("T")[0] : "",
                }
              : prev
          )
        }
        disabled={saving}
        maxDate={new Date()}
        placeholder="YYYY-MM-DD"
        required
        errorMessage="Join date is required"
      />
    </div>
  );
};

export default EditCoachFormFields;
