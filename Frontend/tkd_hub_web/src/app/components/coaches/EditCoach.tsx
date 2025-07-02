import React, { useState, useEffect } from "react";
import equal from "fast-deep-equal";
import { UpsertCoachDto } from "@/app/types/UpsertCoachDto";
import { CoachApiResponse } from "@/app/types/CoachApiResponse";
import { useCoaches } from "@/app/context/CoachContext";
import { useDojaangs } from "@/app/context/DojaangContext";
import { useRanks } from "@/app/context/RankContext";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import { EditModal } from "../common/modals/EditModal";
import EditCoachFormFields from "./EditCoachFormFields";
import EditCoachManagedDojaangs from "./EditCoachManagedDojaangs";
import { Coach } from "@/app/types/Coach"; // Adjust path if needed

type CoachForm = Omit<Coach, "id">;

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
  const { fetchDojaangs } = useDojaangs();
  const { getCoachById, upsertCoach } = useCoaches();
  const { ranks = [], loading: ranksLoading } = useRanks();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allDojaangs, setAllDojaangs] = useState<
    { id: number; name: string }[]
  >([]);
  const [form, setForm] = useState<CoachForm | null>(null);
  const [originalForm, setOriginalForm] = useState<CoachForm | null>(null);
  const [saving, setSaving] = useState(false);

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
          const loadedForm: CoachForm = {
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
              ...managedDojaangs.filter(
                (d: { id: number; name: string }) => !ids.has(d.id)
              ),
            ];
          });
        } else {
          const emptyForm = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: undefined,
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
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
      onClose(true);
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center">Loading coach...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!form) return null;

  return (
    <EditModal
      open={true}
      title={coachId ? "Edit Coach" : "Create Coach"}
      saving={saving}
      onClose={onClose}
    >
      <form
        className="flex-1 overflow-y-auto pr-2 space-y-3"
        onSubmit={handleUpdate}
      >
        <EditCoachFormFields
          form={form}
          setForm={setForm}
          ranks={ranks}
          ranksLoading={ranksLoading}
          loading={loading}
          saving={saving}
        />
        {coachId !== 0 && (
          <EditCoachManagedDojaangs
            coachId={coachId}
            managedDojaangIds={form.managedDojaangIds ?? []}
            allDojaangs={allDojaangs}
            setForm={setForm}
          />
        )}
        <FormActionButtons
          onCancel={() => onClose(false)}
          onSubmitLabel={coachId ? "Update" : "Create"}
          loading={saving}
          disabled={loading || !isFormValid || equal(form, originalForm)}
        />
      </form>
    </EditModal>
  );
};

export default EditCoach;
