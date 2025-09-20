import React from "react";
import { useApiItems } from "../hooks/useApiItems";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";

interface CoachOption {
  id: number;
  label: string;
}

interface Coach {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export default function CoachSelector({
  value,
  onChange,
  label = "Coach",
  readOnly,
}: {
  value: number | null | undefined;
  onChange: (id: number | null) => void;
  label?: string;
  readOnly?: boolean;
}) {
  const { items: coaches, loading } = useApiItems<Coach>("/api/Coaches");

  const options: CoachOption[] = coaches.map((c: Coach) => ({
    id: c.id,
    label:
      `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() ||
      c.email ||
      `#${c.id}`,
  }));

  const selected = options.find((o: CoachOption) => o.id === value) ?? null;

  if (readOnly) {
    return (
      <TextField
        value={selected ? selected.label : ""}
        label={label}
        size="small"
        InputProps={{ readOnly: true }}
        disabled
      />
    );
  }

  return (
    <Autocomplete
      options={options}
      value={selected}
      onChange={(_, v: CoachOption | null) => onChange(v ? v.id : null)}
      getOptionLabel={(o: CoachOption) => o.label ?? String(o.id)}
      loading={loading}
      isOptionEqualToValue={(a: CoachOption, b: CoachOption) => a.id === b.id}
      renderInput={(params: any) => (
        <TextField {...params} label={label} size="small" />
      )}
      clearOnEscape
      sx={{ minWidth: 240 }}
    />
  );
}
