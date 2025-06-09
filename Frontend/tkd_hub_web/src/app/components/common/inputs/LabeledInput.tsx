import React from "react";

interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
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
  ...rest
}) => (
  <div>
    <label htmlFor={name} className="block mb-1 font-medium">
      {label}
    </label>
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
  </div>
);

export default LabeledInput;
