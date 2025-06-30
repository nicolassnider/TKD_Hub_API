import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface LabeledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  datepicker?: boolean;
  selectedDate?: Date | null;
  onDateChange?: (date: Date | null) => void;
  maxDate?: Date;
  errorMessage?: string;
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
  datepicker = false,
  selectedDate,
  onDateChange,
  maxDate,
  errorMessage,
  ...rest
}) => {
  const [touched, setTouched] = React.useState(false);

  // For datepicker, show error if required and not selected
  const showDateError =
    required &&
    datepicker &&
    touched &&
    (!selectedDate || isNaN(selectedDate.getTime()));

  // For text input, show error if required and empty
  const showInputError =
    required &&
    !datepicker &&
    touched &&
    (!value || (typeof value === "string" && value.trim() === ""));

  return (
    <div className="flex flex-col mb-4">
      <label
        htmlFor={name}
        className="mb-1 font-medium text-gray-700 text-base sm:text-sm"
      >
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
            className={`w-full border rounded-lg px-3 py-2 transition duration-200 ${
              showDateError ? "border-red-600" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            <span className="text-red-600 text-xs mt-1">
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
            className={`w-full border rounded-lg px-3 py-2 transition duration-200 ${
              showInputError ? "border-red-600" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            onBlur={() => setTouched(true)}
            {...rest}
          />
          {showInputError && (
            <span className="text-red-600 text-xs mt-1">
              {errorMessage || "This field is required."}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default LabeledInput;
