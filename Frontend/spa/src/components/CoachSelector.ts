import { useApiItems } from "./useApiItems";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";

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
  const { items: coaches, loading } = useApiItems<any>("/api/Coaches");

  const options = coaches.map((c: any) => ({ id: c.id, label: `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || c.email || `#${c.id}` }));

  const selected = options.find((o: any) => o.id === value) ?? null;
  if (readOnly) {
    return <TextField value={selected ? selected.label : ""} label={label} size="small" InputProps={{ readOnly: true }} disabled />;
  }

  return (
    <AutoComplete
      options={options}
      value={selected}
      onChange={(_, v) => onChange(v ? (v as any).id : null)}
      getOptionLabel={(o) => (o as any).label ?? String((o as any).id)}
      loading={loading}
      isOptionEqualToValue={(a, b) => (a as any).id === (b as any).id}
      renderInput={(params) => <TextField {...params} label={label} size="small" />}
      clearOnEscape
      sx={{ minWidth: 240 }}
    />
  );
}
