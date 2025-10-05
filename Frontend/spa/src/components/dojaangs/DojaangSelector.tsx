import { useApiItems } from "../../hooks/useApiItems";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { SelectorOption, LoadingSelectorProps } from "../../types/selectors";
import {
  createSelectorOptions,
  findSelectorOption,
  selectorConfigs,
} from "../../utils/selectorUtils";

// Define Dojaang API response type
interface DojaangDto {
  id: number;
  name: string;
  address: string;
  phoneNumber?: string;
  isActive: boolean;
}

// Dojaang selector specific props extending the base selector props
export interface DojaangSelectorProps
  extends Omit<LoadingSelectorProps, "loading"> {
  // Dojaang selector doesn't need any additional props beyond the base
}

export default function DojaangSelector({
  value,
  onChange,
  label = "Dojaang",
  readOnly,
  disabled,
  error,
  helperText,
  size = "small",
  placeholder,
  required,
}: DojaangSelectorProps) {
  const { items: dojaangs, loading } = useApiItems<DojaangDto>("/api/Dojaangs");

  // Create options for dojaangs using name as label
  const options: SelectorOption[] = dojaangs.map((dojaang) => ({
    id: dojaang.id,
    label: dojaang.name,
    disabled: !dojaang.isActive,
  }));

  const selected = findSelectorOption(options, value);

  if (readOnly) {
    return (
      <TextField
        value={selected ? selected.label : ""}
        label={label}
        size={size}
        error={error}
        helperText={helperText}
        required={required}
        InputProps={{ readOnly: true }}
        disabled
      />
    );
  }

  return (
    <Autocomplete<SelectorOption>
      options={options}
      value={selected}
      onChange={(_, selectedOption: SelectorOption | null) =>
        onChange(selectedOption ? selectedOption.id : null)
      }
      getOptionLabel={(option: SelectorOption) =>
        option.label ?? String(option.id)
      }
      loading={loading}
      disabled={disabled}
      isOptionEqualToValue={(a: SelectorOption, b: SelectorOption) =>
        a.id === b.id
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size={size}
          error={error}
          helperText={helperText}
          required={required}
        />
      )}
      clearOnEscape
      sx={{ minWidth: 240 }}
    />
  );
}

import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { UserDto, DojaangDto, Rank } from "../../types/api";

// Type aliases for this component
type Student = UserDto;
type Coach = UserDto;
type Dojaang = DojaangDto;

interface BaseSelectFieldProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
}

interface StudentSelectProps extends BaseSelectFieldProps {
  students: Student[];
  label?: string;
}

export function StudentSelect({
  students,
  value,
  onChange,
  error,
  required = false,
  fullWidth = true,
  label = "Student",
}: StudentSelectProps) {
  return (
    <FormControl fullWidth={fullWidth} error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        label={label}
        required={required}
      >
        <MenuItem value={0}>Select a Student</MenuItem>
        {students.map((student) => (
          <MenuItem key={student.id} value={student.id}>
            {student.firstName} {student.lastName}
            {student.currentRankName && ` (${student.currentRankName})`}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

interface CoachSelectProps extends BaseSelectFieldProps {
  coaches: Coach[];
  label?: string;
}

export function CoachSelect({
  coaches = [],
  value,
  onChange,
  error,
  required = false,
  fullWidth = true,
  label = "Coach",
}: CoachSelectProps) {
  return (
    <FormControl fullWidth={fullWidth} error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        label={label}
        required={required}
      >
        <MenuItem value={0}>Select a Coach</MenuItem>
        {(coaches || []).map((coach) => (
          <MenuItem key={coach.id} value={coach.id}>
            {coach.firstName} {coach.lastName}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

interface DojaangSelectProps extends BaseSelectFieldProps {
  dojaangs: Dojaang[];
  label?: string;
}

export function DojaangSelect({
  dojaangs = [],
  value,
  onChange,
  error,
  required = false,
  fullWidth = true,
  label = "Dojaang",
}: DojaangSelectProps) {
  return (
    <FormControl fullWidth={fullWidth} error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || 0}
        onChange={(e) => onChange(Number(e.target.value))}
        label={label}
        required={required}
      >
        <MenuItem value={0}>Select a Dojaang</MenuItem>
        {(dojaangs || []).map((dojaang) => (
          <MenuItem key={dojaang.id} value={dojaang.id}>
            {dojaang.name}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

interface RankSelectProps extends BaseSelectFieldProps {
  ranks: Rank[];
  label?: string;
  availableRanks?: Rank[]; // For filtered ranks (e.g., higher than current)
}

export function RankSelect({
  ranks = [],
  value,
  onChange,
  error,
  required = false,
  fullWidth = true,
  label = "Rank",
  availableRanks,
}: RankSelectProps) {
  const ranksToShow = availableRanks || ranks || [];

  return (
    <FormControl fullWidth={fullWidth} error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        label={label}
        required={required}
      >
        <MenuItem value={0}>Select a Rank</MenuItem>
        {ranksToShow.map((rank) => (
          <MenuItem key={rank.id} value={rank.id}>
            {rank.name} {rank.color && `(${rank.color})`}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
