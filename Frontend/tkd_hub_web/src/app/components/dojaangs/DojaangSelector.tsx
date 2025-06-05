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
  <div className="mb-4">
    {label && (
      <label
        className="block font-medium mb-1 text-gray-700"
        htmlFor="dojaang-selector"
      >
        {label}
      </label>
    )}
    <select
      id="dojaang-selector"
      name="dojaang-selector"
      className="w-full rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      value={value ?? ""}
      onChange={(e) => {
        const selected = e.target.value;
        onChange(selected ? Number(selected) : null);
      }}
      disabled={disabled}
      aria-label={label}
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
