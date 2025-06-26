import React from "react";

type GenericSelectorProps<T> = {
  items: T[];
  value: number | null;
  onChange: (id: number | null) => void;
  getLabel: (item: T) => string;
  getId: (item: T) => number;
  label?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  filter?: (item: T) => boolean; // <-- Add this line
};

export function GenericSelector<T>({
  items,
  value,
  onChange,
  getLabel,
  getId,
  label = "Select",
  id = "generic-selector",
  required = false,
  disabled = false,
  placeholder = "Select an option",
  className = "",
  filter, // <-- Add this line
}: GenericSelectorProps<T>) {
  const filteredItems = filter ? items.filter(filter) : items;

  return (
    <div>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <select
        id={id}
        className={`form-control ${className}`}
        value={value !== null && value !== undefined ? String(value) : ""}
        onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {filteredItems.map(item => (
          <option key={getId(item)} value={getId(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
    </div>
  );
}
