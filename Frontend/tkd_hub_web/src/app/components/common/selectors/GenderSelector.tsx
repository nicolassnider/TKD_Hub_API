import React from "react";

type GenderSelectorProps = {
    value: number | undefined;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    id?: string;
    name?: string;
    className?: string;
};

const GenderSelector: React.FC<GenderSelectorProps> = ({
    value,
    onChange,
    disabled = false,
    id = "gender",
    name = "gender",
    className = "",
}) => (
    <select
        id={id}
        name={name}
        title="Gender" // <-- Added for accessibility
        className={`form-select w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
    >
        <option value={0}>Not specified</option>
        <option value={1}>Male</option>
        <option value={2}>Female</option>
    </select>
);

export default GenderSelector;
