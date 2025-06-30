import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import equal from "fast-deep-equal";
import { parseISO, isValid, subYears } from "date-fns";

import { Coach } from "@/app/types/Coach";
import { ManagedDojaang } from "@/app/types/ManagedDojaang";

import { useCoaches } from "@/app/context/CoachContext";
import { useDojaangs } from "@/app/context/DojaangContext";

import ModalCloseButton from "../common/actionButtons/ModalCloseButton";
import LabeledInput from "../common/inputs/LabeledInput";
import ManagedDojaangs from "./ManagedDojaangs";
import { UpsertCoachDto } from "@/app/types/UpsertCoachDto";
import { CoachApiResponse } from "@/app/types/CoachApiResponse";
import { GenericSelector } from "../common/selectors/GenericSelector";
import { useRanks } from "@/app/context/RankContext";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import GenderSelector from "../common/selectors/GenderSelector";

type EditCoachProps = {
  coachId: number;
  onClose: (wasCreated?: boolean) => void;
  handleRefresh?: () => void;
};

type ApiDojaang = {
  id: number;
  name: string;
};

type ApiDojaangResponse = ApiDojaang[] | { data: ApiDojaang[] };

const EditCoach: React.FC<EditCoachProps> = ({
  coachId,
  onClose,
  handleRefresh,
}) => {
  // 1. Context hooks
  const { fetchDojaangs } = useDojaangs();
  const { getCoachById, upsertCoach } = useCoaches();
  const { ranks = [], loading: ranksLoading } = useRanks();

  // 2. State hooks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allDojaangs, setAllDojaangs] = useState<
    { id: number; name: string }[]
  >([]);
  const [form, setForm] = useState<Omit<Coach, "id"> | null>(null);
  const [originalForm, setOriginalForm] = useState<Omit<Coach, "id"> | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  // Manual validation for required fields (including date pickers)
  const isFormValid =
    form &&
    form.firstName &&
    form.lastName &&
    form.email &&
    form.phoneNumber &&
    form.gender !== undefined &&
    form.dateOfBirth &&
    form.currentRankId &&
    form.joinDate;

  // 3. Effects
  useEffect(() => {
    const fetchCoachAndDojaangs = async () => {
      setLoading(true);
      setError(null);
      try {
        if (coachId !== 0) {
          const apiResponse = (await getCoachById(coachId)) as CoachApiResponse;
          const coachData = apiResponse?.data?.coach;
          const managedDojaangs = apiResponse?.data?.managedDojaangs ?? [];

          if (!coachData) throw new Error("Coach not found");
          const loadedForm = {
            firstName: coachData.firstName,
            lastName: coachData.lastName,
            email: coachData.email,
            phoneNumber: coachData.phoneNumber ?? "",
            gender: coachData.gender,
            dateOfBirth: coachData.dateOfBirth?.split("T")[0] ?? "",
            dojaangId: coachData.dojaangId ?? null,
            currentRankId: coachData.currentRankId,
            joinDate: coachData.joinDate ?? "",
            roles: coachData.roles ?? [],
            managedDojaangIds: coachData.managedDojaangIds ?? [],
            isActive: coachData.isActive ?? true,
          };
          setForm(loadedForm);
          setOriginalForm(loadedForm);

          setAllDojaangs((prev) => {
            const ids = new Set(prev.map((d) => d.id));
            return [
              ...prev,
              ...managedDojaangs.filter((d: ManagedDojaang) => !ids.has(d.id)),
            ];
          });
        } else {
          const emptyForm = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: undefined, // default to undefined for placeholder
            dateOfBirth: "",
            dojaangId: null,
            currentRankId: undefined,
            joinDate: "",
            roles: [],
            managedDojaangIds: [],
            isActive: true,
          };
          setForm(emptyForm);
          setOriginalForm(emptyForm);
        }
        const dojaangsData: ApiDojaangResponse =
          (await fetchDojaangs?.()) ?? [];
        setAllDojaangs(
          Array.isArray(dojaangsData)
            ? dojaangsData
            : typeof dojaangsData === "object" &&
              dojaangsData !== null &&
              "data" in dojaangsData
            ? (dojaangsData as { data: ApiDojaang[] }).data
            : []
        );
      } catch (err: unknown) {
        if (err instanceof Error)
          setError(err.message || "Error loading coach");
        else setError("Error loading coach");
      } finally {
        setLoading(false);
      }
    };
    fetchCoachAndDojaangs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coachId]);

  // 4. Functions
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev!,
      [name]: name === "gender" ? Number(value) : value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      const payload: UpsertCoachDto = {
        id: coachId !== 0 ? coachId : null,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber || "",
        gender: form.gender ?? null,
        dateOfBirth: form.dateOfBirth ? form.dateOfBirth : null,
        dojaangId: form.dojaangId ?? null,
        rankId: form.currentRankId ?? null,
        joinDate: form.joinDate ? form.joinDate : null,
        roleIds: (form.roles ?? []).map(Number),
        managedDojaangIds: form.managedDojaangIds ?? [],
      };
      await upsertCoach(payload);
      if (handleRefresh) handleRefresh();
      toast.success(coachId ? "Coach updated!" : "Coach created!");
      onClose(true);
    } catch (err: unknown) {
      if (err instanceof Error)
        toast.error(err.message || "Failed to upsert coach");
      else toast.error("Failed to upsert coach");
    } finally {
      setSaving(false);
    }
  };

  // 5. Render
  if (loading) return <div className="text-center">Loading coach...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!form) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
        <ModalCloseButton onClick={() => onClose(false)} disabled={saving} />
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
          {coachId ? "Edit Coach" : "Create Coach"}
        </h3>
        <form
          className="flex-1 overflow-y-auto pr-2 space-y-3"
          onSubmit={handleUpdate}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Name Input*/}
            <LabeledInput
              label="First Name"
              name="firstName"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={handleChange}
              disabled={saving}
              required
            />
            {/* Last Name Input */}
            <LabeledInput
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              disabled={saving}
              required
            />
            {/* Email Input */}
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
            {/* Phone Number Input */}
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
            {/* Gender selector */}
            <GenderSelector
              value={form.gender ?? null}
              onChange={(id) =>
                setForm((prev) => ({
                  ...prev!,
                  gender: typeof id === "number" ? id : undefined,
                }))
              }
              disabled={loading}
              required
              className="px-3 py-2"
            />
            {/* Date of birth input */}
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
                setForm((prev) => ({
                  ...prev!,
                  dateOfBirth: date ? date.toISOString().split("T")[0] : "",
                }))
              }
              disabled={saving}
              maxDate={subYears(new Date(), 12)}
              required
              errorMessage="Date of birth is required"
            />
            {/* Rank selector */}
            <GenericSelector
              items={ranks}
              value={form.currentRankId ?? null}
              onChange={(id) =>
                setForm((prev) => ({
                  ...prev!,
                  currentRankId: id ?? undefined,
                }))
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
            {/* Join date */}
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
                setForm((prev) => ({
                  ...prev!,
                  joinDate: date ? date.toISOString().split("T")[0] : "",
                }))
              }
              disabled={saving}
              maxDate={new Date()}
              placeholder="YYYY-MM-DD"
              required
              errorMessage="Join date is required"
            />
          </div>
          {coachId !== 0 && (
            <div className="mb-4">
              <label className="block font-medium mb-1">Managed Dojaangs</label>
              <ManagedDojaangs
                managedDojaangIds={form.managedDojaangIds ?? []}
                allDojaangs={allDojaangs}
                coachId={coachId}
                onAdd={(id) =>
                  setForm((f) => ({
                    ...f!,
                    managedDojaangIds: [...(f?.managedDojaangIds ?? []), id],
                  }))
                }
                onRemove={(id) =>
                  setForm((f) => ({
                    ...f!,
                    managedDojaangIds: (f?.managedDojaangIds ?? []).filter(
                      (did) => did !== id
                    ),
                  }))
                }
              />
            </div>
          )}
          <FormActionButtons
            onCancel={() => onClose(false)}
            onSubmitLabel={coachId ? "Update" : "Create"}
            loading={saving}
            disabled={loading || !isFormValid || equal(form, originalForm)}
          />
        </form>
      </div>
    </div>
  );
};

export default EditCoach;
