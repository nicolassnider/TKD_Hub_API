import { Gender } from "@/app/enums/Gender";
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
        <option value={Gender.OTHER}>Not specified</option>
        <option value={Gender.MALE}>Male</option>
        <option value={Gender.FEMALE}>Female</option>
    </select>
);

export default GenderSelector;
