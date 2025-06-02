import React from "react";

type Dojaang = {
  id: number;
  name: string;
};

type DojaangSelectorProps = {
  allDojaangs: Dojaang[];
  value: number | null;
  onChange: (id: number | null) => void;
  label?: string;
  disabled?: boolean;
};

const DojaangSelector: React.FC<DojaangSelectorProps> = ({
  allDojaangs,
  value,
  onChange,
  label = "Select Dojaang",
  disabled = false,
}) => (
  <div>
    {label && (
      <label className="block font-medium mb-1">{label}</label>
    )}
    <select
      className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white"
      value={value ?? ""}
      onChange={(e) => {
        const selected = e.target.value;
        onChange(selected ? Number(selected) : null);
      }}
      disabled={disabled}
    >
      <option value="">None</option>
      {allDojaangs.map((d) => (
        <option key={d.id} value={d.id}>
          {d.name} #{d.id}
        </option>
      ))}
    </select>
  </div>
);

export default DojaangSelector;
