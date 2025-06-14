import React, { useState, useEffect } from "react";
import LabeledInput from "../common/inputs/LabeledInput";
import DojaangSelector from "../dojaangs/DojaangSelector";
import CoachSelector from "../coaches/CoachSelector";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import ModalCloseButton from "../common/actionButtons/ModalCloseButton";
import { TrainingClass } from "@/app/types/TrainingClass";
import { daysOfWeek } from "@/app/const/daysOfWeek";
import { ClassSchedule } from "@/app/types/ClassSchedule";

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
    const [form, setForm] = useState<Omit<TrainingClass, "id">>(defaultForm);
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        if (initialData) {
            const { ...rest } = initialData;
            setForm(rest);
        } else {
            setForm(defaultForm);
        }
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCoachChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const coachId = e.target.value ? Number(e.target.value) : 0;
        setForm((prev) => ({
            ...prev,
            coachId,
        }));
    };

    // Schedules handlers
    const handleScheduleChange = (idx: number, field: keyof ClassSchedule, value: string | number) => {
        if (field === "day") {
            const dayValue = Number(value);
            // Validate day input
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
                    day: 0,
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
            // Prepare the data for submission
            const schedules = form.schedules.map(s =>
                s.id !== undefined
                    ? { id: s.id, day: s.day, startTime: s.startTime, endTime: s.endTime }
                    : { day: s.day, startTime: s.startTime, endTime: s.endTime }
            );

            // For update, include id; for create, do not
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

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col overflow-y-auto">
                <ModalCloseButton onClick={() => onClose(false)} disabled={saving} />
                <h2 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Class" : "Create Class"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <LabeledInput
                        label="Class Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter class name"
                    />
                    <DojaangSelector
                        value={form.dojaangId === 0 ? null : form.dojaangId}
                        onChange={id => setForm({ ...form, dojaangId: id ?? 0 })}
                    />
                    <CoachSelector
                        value={form.coachId ? String(form.coachId) : ""}
                        onChange={handleCoachChange}
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
                                            <label htmlFor={`day-${idx}`} className="font-medium mb-1">
                                                Day
                                            </label>
                                            <select
                                                id={`day-${idx}`}
                                                name={`day-${idx}`}
                                                value={schedule.day}
                                                onChange={e => handleScheduleChange(idx, "day", Number(e.target.value))}
                                                required
                                                title="Day of the week"
                                                className="rounded border border-gray-300 px-2 py-1 bg-white w-full"
                                            >
                                                {daysOfWeek.map(day => (
                                                    <option key={day.value} value={day.value}>
                                                        {day.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Start/End/Remove in a row on small screens */}
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
