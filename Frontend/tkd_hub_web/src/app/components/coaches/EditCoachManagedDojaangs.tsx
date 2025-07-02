import React from "react";
import ManagedDojaangs from "./ManagedDojaangs";
import { Coach } from "@/app/types/Coach"; // Adjust path as needed

type CoachForm = Omit<Coach, "id">;

type Props = {
  coachId: number;
  managedDojaangIds: number[];
  allDojaangs: { id: number; name: string }[];
  setForm: React.Dispatch<React.SetStateAction<CoachForm | null>>;
};

const EditCoachManagedDojaangs: React.FC<Props> = ({
  coachId,
  managedDojaangIds,
  allDojaangs,
  setForm,
}) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">Managed Dojaangs</label>
    <ManagedDojaangs
      managedDojaangIds={managedDojaangIds}
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
            (did: number) => did !== id
          ),
        }))
      }
    />
  </div>
);

export default EditCoachManagedDojaangs;
