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
  filter?: (item: T) => boolean;
  errorMessage?: string;
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
  filter,
  errorMessage,
}: GenericSelectorProps<T>) {
  const [touched, setTouched] = React.useState(false);
  const filteredItems = filter ? items.filter(filter) : items;

  const showError =
    required &&
    touched &&
    (value === null || value === undefined);

  return (
    <div>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <select
        id={id}
        className={`form-control ${className} ${showError ? "border-red-500" : ""}`}
        value={value !== null && value !== undefined ? String(value) : ""}
        onChange={e => {
          setTouched(true);
          onChange(e.target.value ? Number(e.target.value) : null);
        }}
        onBlur={() => setTouched(true)}
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
      {showError && (
        <span className="text-red-600 text-xs">
          {errorMessage || "This field is required."}
        </span>
      )}
    </div>
  );
}
