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
    required && touched && (value === null || value === undefined);

  // Neutral theme classes similar to LabeledInput
  const selectorClass =
    "block w-full bg-neutral-700 text-neutral-100 border-2 border-neutral-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm";

  return (
    <div className="w-full mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 font-semibold text-neutral-100"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`${selectorClass} ${
          showError ? "border-red-400" : ""
        } ${className}`}
        value={value !== null && value !== undefined ? String(value) : ""}
        onChange={(e) => {
          setTouched(true);
          onChange(e.target.value ? Number(e.target.value) : null);
        }}
        onBlur={() => setTouched(true)}
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {filteredItems.map((item) => (
          <option key={getId(item)} value={getId(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
      {showError && (
        <span className="text-red-400 text-xs mt-1 block">
          {errorMessage || "This field is required."}
        </span>
      )}
    </div>
  );
}
