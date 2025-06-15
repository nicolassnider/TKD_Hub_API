import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import equal from 'fast-deep-equal';

import { Coach } from '@/app/types/Coach';
import { ManagedDojaang } from '@/app/types/ManagedDojaang';

import { useAuth } from '@/app/context/AuthContext';
import { useApiRequest } from '@/app/utils/api';
import { useCoaches } from '@/app/context/CoachContext';

import RanksSelector from '@/app/components/common/selectors/RanksSelector';
import GenderSelector from '../common/selectors/GenderSelector';
import ModalCloseButton from '../common/actionButtons/ModalCloseButton';
import LabeledInput from '../common/inputs/LabeledInput';
import { UpsertCoachDto } from '@/app/types/UserCoachDto';
import ManagedDojaangs from './ManagedDojaangs';

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

export type CoachApiResponse = {
    data: {
        coach: Coach;
        managedDojaangs: ManagedDojaang[];
    };
};

const EditCoach: React.FC<EditCoachProps> = ({
    coachId,
    onClose,
    handleRefresh,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allDojaangs, setAllDojaangs] = useState<{ id: number; name: string }[]>([]);
    const [form, setForm] = useState<Omit<Coach, 'id'> | null>(null);
    const [originalForm, setOriginalForm] = useState<Omit<Coach, 'id'> | null>(null);
    const { getToken } = useAuth();
    const { apiRequest } = useApiRequest();
    const [saving, setSaving] = useState(false);

    // Use CoachContext
    const { getCoachById, upsertCoach } = useCoaches();

    useEffect(() => {
        const fetchCoachAndDojaangs = async () => {
            setLoading(true);
            setError(null);
            try {
                if (coachId !== 0) {
                    const apiResponse = await getCoachById(coachId) as CoachApiResponse;
                    const coachData = apiResponse?.data?.coach;
                    const managedDojaangs = apiResponse?.data?.managedDojaangs ?? [];

                    if (!coachData) throw new Error('Coach not found');
                    const loadedForm = {
                        firstName: coachData.firstName,
                        lastName: coachData.lastName,
                        email: coachData.email,
                        phoneNumber: coachData.phoneNumber ?? '',
                        gender: coachData.gender,
                        dateOfBirth: coachData.dateOfBirth?.split('T')[0] ?? '',
                        dojaangId: coachData.dojaangId ?? null,
                        currentRankId: coachData.currentRankId,
                        joinDate: coachData.joinDate ?? '',
                        roles: coachData.roles ?? [],
                        managedDojaangIds: coachData.managedDojaangIds ?? [],
                        isActive: coachData.isActive ?? true,
                    };
                    setForm(loadedForm);
                    setOriginalForm(loadedForm);

                    // Optionally merge managedDojaangs into allDojaangs
                    setAllDojaangs((prev) => {
                        const ids = new Set(prev.map(d => d.id));
                        return [
                            ...prev,
                            ...managedDojaangs.filter((d: ManagedDojaang) => !ids.has(d.id))
                        ];
                    });
                } else {
                    const emptyForm = {
                        firstName: '',
                        lastName: '',
                        email: '',
                        phoneNumber: '',
                        gender: 0,
                        dateOfBirth: '',
                        dojaangId: null,
                        currentRankId: 0,
                        joinDate: '',
                        roles: [],
                        managedDojaangIds: [],
                        isActive: true,
                    };
                    setForm(emptyForm);
                    setOriginalForm(emptyForm);
                }
                const dojaangsData: ApiDojaangResponse = await apiRequest<ApiDojaangResponse>(
                    "/Dojaang",
                    {
                        headers: { Authorization: `Bearer ${getToken()}` },
                    }
                );
                setAllDojaangs(
                    Array.isArray(dojaangsData)
                        ? dojaangsData
                        : dojaangsData.data || []
                );
            } catch (err: unknown) {
                if (err instanceof Error)
                    setError(err.message || 'Error loading coach');
                else setError('Error loading coach');
            } finally {
                setLoading(false);
            }
        };
        fetchCoachAndDojaangs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coachId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev!,
            [name]: name === "gender" ? Number(value) : value,
        }));
    };

    const handleUpdate = async () => {
        if (!form) return;
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
                roleIds: (form.roles ?? []).map(Number), // <-- convert to number[]
                managedDojaangIds: form.managedDojaangIds ?? [],
            };
            await upsertCoach(payload);
            if (handleRefresh) handleRefresh();
            toast.success(coachId ? 'Coach updated!' : 'Coach created!');
            onClose(true);
        } catch (err: unknown) {
            if (err instanceof Error)
                toast.error(err.message || 'Failed to upsert coach');
            else toast.error('Failed to upsert coach');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center">Loading coach...</div>;
    if (error) return <div className="text-danger text-center">{error}</div>;
    if (!form) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
                <ModalCloseButton onClick={() => onClose(false)} disabled={saving} />

                <form
                    className="flex-1 overflow-y-auto pr-2 space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate();
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <LabeledInput
                            label="First Name"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            disabled={saving}
                        />
                        <LabeledInput
                            label="Last Name"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <LabeledInput
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled={saving}
                            placeholder="Enter email address"
                        />
                        <LabeledInput
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            value={form.phoneNumber || ''}
                            onChange={handleChange}
                            disabled={saving}
                            placeholder="Enter phone number"
                        />

                        <div>
                            <label
                                className="block font-medium mb-1"
                                htmlFor="gender"
                            >
                                Gender
                            </label>
                            <GenderSelector
                                value={form.gender}
                                onChange={handleChange}
                                disabled={loading}
                                className="px-3 py-2"
                            />
                        </div>
                        <LabeledInput
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={form.dateOfBirth || ''}
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <RanksSelector
                            label="Rank"
                            value={form.currentRankId ?? 0}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f!,
                                    currentRankId: e.target.value ? Number(e.target.value) : 0,
                                }))
                            }
                            disabled={loading}
                            filter="black"
                            className="form-input px-3 py-2 border border-gray-300 rounded w-full"
                        />

                        <LabeledInput
                            label="Join Date"
                            name="joinDate"
                            type="date"
                            value={form.joinDate || ""}
                            onChange={handleChange}
                            disabled={saving}
                            placeholder="YYYY-MM-DD"
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
                                        managedDojaangIds: (f?.managedDojaangIds ?? []).filter((did) => did !== id),
                                    }))
                                }
                            />
                        </div>
                    )}
                </form>
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 flex items-center justify-center"
                        onClick={() => onClose(false)}
                    >
                        <i className="bi bi-x-lg md:hidden text-lg"></i>
                        <span className="hidden md:inline">Cancel</span>
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={loading || equal(form, originalForm)}
                        onClick={handleUpdate}
                    >
                        <i className="bi bi-check-lg md:hidden text-lg"></i>
                        <span className="hidden md:inline">{coachId ? "Update" : "Create"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCoach;
