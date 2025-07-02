import React from "react";
import { useCoaches } from "@/app/context/CoachContext";
import { GenericSelector } from "../common/selectors/GenericSelector";
import GenericButton from "../common/actionButtons/GenericButton";

type ManagedDojaangsProps = {
  managedDojaangIds: number[];
  allDojaangs?: { id: number; name: string }[];
  onAdd?: (id: number) => void;
  onRemove?: (id: number) => void;
  coachId?: number;
  onRemoveSuccess?: (id: number) => void;
};

const ManagedDojaangs: React.FC<ManagedDojaangsProps> = ({
  managedDojaangIds,
  allDojaangs = [],
  onAdd,
  onRemove,
  coachId,
  onRemoveSuccess,
}) => {
  const { removeCoachFromDojaang } = useCoaches();

  const availableDojaangs = allDojaangs.filter(
    (d) => !managedDojaangIds.includes(d.id)
  );

  const getDojaangName = (id: number) =>
    allDojaangs.find((d) => d.id === id)?.name || `Dojaang #${id}`;

  const handleRemove = async (dojaangId: number) => {
    if (!coachId) {
      if (onRemove) onRemove(dojaangId);
      return;
    }
    try {
      await removeCoachFromDojaang(coachId, dojaangId);
      if (onRemove) onRemove(dojaangId);
      if (onRemoveSuccess) onRemoveSuccess(dojaangId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "Failed to remove managed dojaang.");
      } else {
        alert("Failed to remove managed dojaang.");
      }
    }
  };

  return (
    <div>
      <ul className="list-none mb-2 pl-0">
        {managedDojaangIds.length === 0 && <li className="text-muted">None</li>}
        {managedDojaangIds.map((id) => (
          <li key={id} className="flex items-center gap-2">
            <span>
              {getDojaangName(id)}{" "}
              <span className="text-xs text-gray-500">#{id}</span>
            </span>
            {onRemove && (
              <GenericButton
                type="button"
                variant="warning"
                className="ml-2 text-xs px-2 py-1"
                onClick={() => handleRemove(id)}
                title="Remove"
              >
                Remove
              </GenericButton>
            )}
          </li>
        ))}
      </ul>
      {onAdd && availableDojaangs.length > 0 && (
        <div className="flex items-center gap-2">
          <label htmlFor="add-dojaang-select" className="sr-only">
            Add Dojaang
          </label>
          <GenericSelector
            items={availableDojaangs}
            value={null}
            onChange={(id) => {
              if (id && onAdd) onAdd(id);
            }}
            getLabel={(d) => d.name}
            getId={(d) => d.id}
            label={undefined}
            placeholder="Add Dojaang..."
            className="border rounded px-2 py-1"
            id="add-dojaang-select"
          />
        </div>
      )}
    </div>
  );
};

export default ManagedDojaangs;
