import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface LabeledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  as?: "input" | "textarea";
  datepicker?: boolean;
  selectedDate?: Date | null;
  onDateChange?: (date: Date | null) => void;
  maxDate?: Date;
  errorMessage?: string;
  rows?: number;
}

// Utility to omit input-only props for textarea
function omitInputOnlyProps(rest: Record<string, unknown>) {
  const inputOnly = [
    "type",
    "min",
    "max",
    "step",
    "pattern",
    "inputMode",
    "autoComplete",
    "autoFocus",
    "form",
    "list",
    "multiple",
    "size",
    "maxLength",
    "minLength",
    // ...add more input-only props if needed
  ];
  const result: Record<string, unknown> = {};
  Object.keys(rest).forEach((key) => {
    if (!inputOnly.includes(key)) {
      result[key] = rest[key];
    }
  });
  return result;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
  disabled,
  placeholder,
  title,
  as = "input",
  datepicker = false,
  selectedDate,
  onDateChange,
  maxDate,
  errorMessage,
  rows = 4,
  ...rest
}) => {
  const [touched, setTouched] = React.useState(false);

  // For datepicker, show error if required and not selected
  const showDateError =
    required &&
    datepicker &&
    touched &&
    (!selectedDate || isNaN(selectedDate.getTime()));

  // For text input/textarea, show error if required and empty
  const showInputError =
    required &&
    !datepicker &&
    touched &&
    (!value || (typeof value === "string" && value.trim() === ""));

  // Improved neutral theme classes for better input visibility
  const labelClass = "block mb-1 font-semibold text-neutral-100";
  const inputClass =
    "block w-full bg-neutral-700 text-neutral-100 border-2 border-neutral-400 rounded-md px-3 py-2 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <div className="form-control w-full mb-4">
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {datepicker ? (
        <>
          <DatePicker
            id={name}
            selected={selectedDate}
            onChange={(date) => {
              setTouched(true);
              onDateChange?.(date);
            }}
            className={`${inputClass} ${showDateError ? "border-red-400" : ""}`}
            placeholderText={placeholder}
            disabled={disabled}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={50}
            maxDate={maxDate}
            onBlur={() => setTouched(true)}
          />
          {showDateError && (
            <span className={errorClass}>
              {errorMessage || "This field is required."}
            </span>
          )}
        </>
      ) : as === "textarea" ? (
        <>
          <textarea
            id={name}
            name={name}
            className={`${inputClass} min-h-[100px] ${
              showInputError ? "border-red-400" : ""
            }`}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => {
              setTouched(true);
              // Cast to correct type for parent handler
              onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>);
            }}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            title={title || label}
            rows={rows}
            {...omitInputOnlyProps(rest)}
            onBlur={() => setTouched(true)}
          />
          {showInputError && (
            <span className={errorClass}>
              {errorMessage || "This field is required."}
            </span>
          )}
        </>
      ) : (
        <>
          <input
            id={name}
            name={name}
            type={type}
            className={`${inputClass} ${
              showInputError ? "border-red-400" : ""
            }`}
            value={
              typeof value === "string"
                ? value
                : value !== undefined && value !== null
                ? String(value)
                : ""
            }
            onChange={(e) => {
              setTouched(true);
              onChange?.(e);
            }}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            title={title || label}
            {...rest}
            onBlur={() => setTouched(true)}
          />
          {showInputError && (
            <span className={errorClass}>
              {errorMessage || "This field is required."}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default LabeledInput;
