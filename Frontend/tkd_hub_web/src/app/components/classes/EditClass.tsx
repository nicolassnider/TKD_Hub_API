import React, { useState, useEffect, useRef } from "react";

import LabeledInput from "../common/inputs/LabeledInput";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import ModalCloseButton from "../common/actionButtons/ModalCloseButton";

import { TrainingClass } from "@/app/types/TrainingClass";
import { daysOfWeek } from "@/app/const/daysOfWeek";
import { ClassSchedule } from "@/app/types/ClassSchedule";
import { Coach } from "@/app/types/Coach";
import { useCoaches } from "@/app/context/CoachContext";
import { useDojaangs } from "@/app/context/DojaangContext";
import { GenericSelector } from "../common/selectors/GenericSelector";
import { DayOfWeek } from "@/app/types/DayOfWeek";

type EditClassProps = {
    open: boolean;
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
    schedules: []
    // Add other fields as needed
};

const EditClass: React.FC<EditClassProps> = ({ open, onClose, onSubmit, initialData }) => {
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

    const handleScheduleChange = (idx: number, field: keyof ClassSchedule, value: string | number) => {
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
                    endTime: ""
                } as ClassSchedule
            ]
        }));
    };

    const handleRemoveSchedule = (idx: number) => {
        setForm((prev) => ({
            ...prev,
            schedules: prev.schedules.filter((_, i) => i !== idx)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const schedules = form.schedules.map(s =>
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
                    schedules
                }
                : {
                    name: form.name,
                    dojaangId: form.dojaangId,
                    dojaangName: form.dojaangName,
                    coachId: form.coachId,
                    coachName: form.coachName,
                    schedules
                };

            await onSubmit(
                submitData as Omit<TrainingClass, "id">,
                initialData?.id
            );
            onClose();
        } finally {
            setSaving(false);
        }
    };

    // 5. Render
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col overflow-y-auto">
                <ModalCloseButton onClick={() => onClose(false)} disabled={saving} />
                <h2 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Class" : "Create Class"}
                </h2>
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
                        onChange={(id: number | null) => setForm({ ...form, dojaangId: id ?? 0 })}
                        getLabel={d => d.name}
                        getId={d => d.id}
                        required
                        disabled={saving || loadingDojaangs}
                        label="Dojaang"
                        placeholder="Select a dojaang"
                    />
                    {/* Coach Selector */}
                    <GenericSelector
                        items={availableCoaches}
                        value={form.coachId === 0 ? null : form.coachId}
                        onChange={(id: number | null) => setForm({ ...form, coachId: id ?? 0 })}
                        getLabel={c => `${c.firstName} ${c.lastName}${c.email ? ` (${c.email})` : ""}`}
                        getId={c => c.id}
                        required
                        disabled={saving}
                        label="Coach"
                        placeholder="Select a coach"
                    />

                    {/* Schedules Section */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">Schedules</label>
                        <div className="mt-2 mb-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
                                onClick={handleAddSchedule}
                            >
                                Add Schedule
                            </button>
                        </div>
                        {form.schedules.length > 0 && (
                            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                                {form.schedules.map((schedule, idx) => (
                                    <div
                                        key={schedule.id ?? idx}
                                        className="flex flex-col gap-2 bg-gray-50 rounded p-2 md:flex-row md:items-stretch flex-wrap"
                                    >
                                        <div className="flex flex-col min-w-[120px] w-full md:w-1/4">
                                            <GenericSelector
                                                items={daysOfWeek}
                                                value={Number(schedule.day)}
                                                onChange={(val: number | null) => handleScheduleChange(idx, "day", val ?? 0)}
                                                getLabel={d => d.label}
                                                getId={d => d.value}
                                                required
                                                label="Day"
                                                placeholder="Select day"
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex flex-row gap-2 w-full md:flex-col md:w-2/4 items-end">
                                            <div className="flex flex-col min-w-[80px] w-1/2 md:w-full">
                                                <LabeledInput
                                                    label="Start Time"
                                                    name={`startTime-${idx}`}
                                                    type="time"
                                                    value={schedule.startTime}
                                                    onChange={e => handleScheduleChange(idx, "startTime", e.target.value)}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex flex-col min-w-[80px] w-1/2 md:w-full">
                                                <LabeledInput
                                                    label="End Time"
                                                    name={`endTime-${idx}`}
                                                    type="time"
                                                    value={schedule.endTime}
                                                    onChange={e => handleScheduleChange(idx, "endTime", e.target.value)}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex items-end ml-auto">
                                                <button
                                                    type="button"
                                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors h-full flex items-center justify-center"
                                                    onClick={() => handleRemoveSchedule(idx)}
                                                    title="Remove schedule"
                                                >
                                                    <i className="bi bi-x-lg text-lg" aria-hidden="true"></i>
                                                    <span className="sr-only">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <FormActionButtons
                        onCancel={onClose}
                        onSubmitLabel={initialData ? "Update" : "Create"}
                    />
                </form>
            </div>
        </div>
    );
};

export default EditClass;
