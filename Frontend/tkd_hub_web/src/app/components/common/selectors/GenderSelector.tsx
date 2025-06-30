import React from "react";
import { GenericSelector } from "./GenericSelector";
import { Gender } from "@/app/enums/Gender";

type GenderSelectorProps = {
  value: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  className?: string;
};

const genderOptions = [
  { id: Gender.MALE, label: "Male" },
  { id: Gender.FEMALE, label: "Female" },
  { id: Gender.OTHER, label: "Other" },
];

export const GenderSelector: React.FC<GenderSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
  label = "Gender",
  className = "",
}) => (
  <GenericSelector
    items={genderOptions}
    value={value as number | null}
    onChange={onChange}
    getLabel={(g) => g.label}
    getId={(g) => g.id as number}
    disabled={disabled}
    required={required}
    label={label}
    className={className}
    placeholder="Select an option"
  />
);

export default GenderSelector;
