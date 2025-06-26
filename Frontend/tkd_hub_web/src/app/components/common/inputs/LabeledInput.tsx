import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  datepicker?: boolean;
  selectedDate?: Date | null;
  onDateChange?: (date: Date | null) => void;
  maxDate?: Date; // <-- Add this line
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
  ...rest
}) => (
  <div>
    <label htmlFor={name} className="block mb-1 font-medium">
      {label}
    </label>
    {datepicker ? (
      <DatePicker
        id={name}
        selected={selectedDate}
        onChange={onDateChange}
        className="w-full border rounded px-3 py-2"
        placeholderText={placeholder}
        disabled={disabled}
        required={required}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={50}
        maxDate={maxDate}
      // Do NOT spread ...rest here!
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        title={title || label}
        {...rest}
      />
    )}
  </div>
);

export default LabeledInput;
