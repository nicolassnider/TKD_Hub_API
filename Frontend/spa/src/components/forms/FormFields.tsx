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
  coaches,
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
        {coaches.map((coach) => (
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
  dojaangs,
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
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        label={label}
        required={required}
      >
        <MenuItem value={0}>Select a Dojaang</MenuItem>
        {dojaangs.map((dojaang) => (
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
  ranks,
  value,
  onChange,
  error,
  required = false,
  fullWidth = true,
  label = "Rank",
  availableRanks,
}: RankSelectProps) {
  const ranksToShow = availableRanks || ranks;

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
