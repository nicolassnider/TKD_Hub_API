import React, { useState, useEffect, useRef } from "react";

import LabeledInput from "../common/inputs/LabeledInput";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import { TrainingClass } from "@/app/types/TrainingClass";
import { ClassSchedule } from "@/app/types/ClassSchedule";
import { Coach } from "@/app/types/Coach";
import { useCoaches } from "@/app/context/CoachContext";
import { useDojaangs } from "@/app/context/DojaangContext";
import { GenericSelector } from "../common/selectors/GenericSelector";
import { DayOfWeek } from "@/app/types/DayOfWeek";
import ClassSchedulesSection from "./ClassSchedulesSection";
import { EditModal } from "../common/modals/EditModal";

type EditClassProps = {
  classId?: number;
  open?: boolean; // for compatibility, but not required if always modal
  onClose: (wasCreated?: boolean) => void;
  onSubmit: (data: Omit<TrainingClass, "id">, id?: number) => void;
  initialData?: TrainingClass | null;
};

const defaultForm: Omit<TrainingClass, "id"> = {
  name: "",
  dojaangName: "",
  coachName: "",
  coachId: 0,
  dojaangId: 0,
  schedules: [],
  // Add other fields as needed
};

const EditClass: React.FC<EditClassProps> = ({
  open = true,
  onClose,
  onSubmit,
  initialData,
}) => {
  // 1. Context hooks
  const { getCoachesByDojaang } = useCoaches();
  const { dojaangs, loading: loadingDojaangs } = useDojaangs();

  // 2. State hooks
  const [form, setForm] = useState<Omit<TrainingClass, "id">>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [availableCoaches, setAvailableCoaches] = useState<Coach[]>([]);
  const coachesCache = useRef<{ [key: number]: Coach[] }>({});

  // 3. Effects
  useEffect(() => {
    if (form.dojaangId) {
      // Check cache first
      if (coachesCache.current[form.dojaangId]) {
        setAvailableCoaches(coachesCache.current[form.dojaangId]);
      } else {
        getCoachesByDojaang(form.dojaangId).then((coaches) => {
          coachesCache.current[form.dojaangId] = coaches;
          setAvailableCoaches(coaches);
        });
      }
    } else {
      setAvailableCoaches([]);
    }
  }, [form.dojaangId, getCoachesByDojaang]);

  useEffect(() => {
    if (initialData) {
      const { ...rest } = initialData;
      setForm(rest);
    } else {
      setForm(defaultForm);
    }
  }, [initialData, open]);

  // 4. Functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleScheduleChange = (
    idx: number,
    field: keyof ClassSchedule,
    value: string | number
  ) => {
    if (field === "day") {
      const dayValue = Number(value);
      if (dayValue < 0 || dayValue > 6) {
        alert("Please enter a valid day (0 for Sunday to 6 for Saturday).");
        return;
      }
    }
    setForm((prev) => ({
      ...prev,
      schedules: prev.schedules.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      ),
    }));
  };

  const handleAddSchedule = () => {
    setForm((prev) => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        {
          day: 0 as unknown as DayOfWeek,
          startTime: "",
          endTime: "",
        } as ClassSchedule,
      ],
    }));
  };

  const handleRemoveSchedule = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const schedules = form.schedules.map((s) =>
        s.id !== undefined
          ? { id: s.id, day: s.day, startTime: s.startTime, endTime: s.endTime }
          : { day: s.day, startTime: s.startTime, endTime: s.endTime }
      );

      const submitData: Omit<TrainingClass, "id"> | TrainingClass = initialData
        ? {
            id: initialData.id,
            name: form.name,
            dojaangId: form.dojaangId,
            dojaangName: form.dojaangName,
            coachId: form.coachId,
            coachName: form.coachName,
            schedules,
          }
        : {
            name: form.name,
            dojaangId: form.dojaangId,
            dojaangName: form.dojaangName,
            coachId: form.coachId,
            coachName: form.coachName,
            schedules,
          };

      await onSubmit(submitData as Omit<TrainingClass, "id">, initialData?.id);
      onClose(true);
    } finally {
      setSaving(false);
    }
  };

  // 5. Render
  if (!open) return null;

  return (
    <EditModal
      open={open}
      title={initialData ? "Edit Class" : "Create Class"}
      saving={saving}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        {/*Class name*/}
        <LabeledInput
          label="Class Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Enter class name"
        />
        {/* Dojaang Selector */}
        <GenericSelector
          items={dojaangs}
          value={form.dojaangId === 0 ? null : form.dojaangId}
          onChange={(id: number | null) =>
            setForm({ ...form, dojaangId: id ?? 0 })
          }
          getLabel={(d) => d.name}
          getId={(d) => d.id}
          required
          disabled={saving || loadingDojaangs}
          label="Dojaang"
          placeholder="Select a dojaang"
        />
        {/* Coach Selector */}
        <GenericSelector
          items={availableCoaches}
          value={form.coachId === 0 ? null : form.coachId}
          onChange={(id: number | null) =>
            setForm({ ...form, coachId: id ?? 0 })
          }
          getLabel={(c) =>
            `${c.firstName} ${c.lastName}${c.email ? ` (${c.email})` : ""}`
          }
          getId={(c) => c.id}
          required
          disabled={saving}
          label="Coach"
          placeholder="Select a coach"
        />

        {/* Schedules Section */}
        <ClassSchedulesSection
          schedules={form.schedules}
          onAdd={handleAddSchedule}
          onRemove={handleRemoveSchedule}
          onChange={handleScheduleChange}
        />

        <FormActionButtons
          onCancel={() => onClose(false)}
          onSubmitLabel={initialData ? "Update" : "Create"}
          loading={saving}
        />
      </form>
    </EditModal>
  );
};

export default EditClass;
