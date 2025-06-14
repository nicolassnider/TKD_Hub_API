import React, { useEffect } from "react";
import { useDojaangs } from "@/app/context/DojaangContext";

type Dojaang = {
  id: number;
  name: string;
};

type DojaangSelectorProps = {
  value: number | null;
  onChange: (id: number | null) => void;
  label?: string;
  disabled?: boolean;
  allDojaangs?: Dojaang[]; // Optional, fallback to context if not provided
  className?: string; // <-- Add this line
};

const DojaangSelector: React.FC<DojaangSelectorProps> = ({
  value,
  onChange,
  label = "Select Dojaang",
  disabled = false,
  allDojaangs,
  className, // <-- Add this line
}) => {
  // Use context if allDojaangs not provided
  const { dojaangs: contextDojaangs, fetchDojaangs } = useDojaangs();
  const dojaangs = allDojaangs ?? contextDojaangs ?? [];

  useEffect(() => {
    if (!allDojaangs) {
      fetchDojaangs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDojaangs]);

  return (
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
        className={
          className
            ? className
            : "w-full rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        }
        value={value ?? ""}
        onChange={(e) => {
          const selected = e.target.value;
          onChange(selected ? Number(selected) : null);
        }}
        disabled={disabled}
        aria-label={label}
      >
        <option value="">None</option>
        {dojaangs.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DojaangSelector;
