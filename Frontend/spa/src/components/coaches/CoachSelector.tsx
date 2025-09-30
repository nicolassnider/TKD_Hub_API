import { useApiItems } from "../../hooks/useApiItems";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { UserDto } from "../../types/api";
import { SelectorOption, LoadingSelectorProps } from "../../types/selectors";
import {
  createSelectorOptions,
  findSelectorOption,
  selectorConfigs,
} from "../../utils/selectorUtils";

// Coach selector specific props extending the base selector props
export interface CoachSelectorProps
  extends Omit<LoadingSelectorProps, "loading"> {
  // Coach selector doesn't need any additional props beyond the base
}

export default function CoachSelector({
  value,
  onChange,
  label = "Coach",
  readOnly,
  disabled,
  error,
  helperText,
  size = "small",
  placeholder,
  required,
}: CoachSelectorProps) {
  const { items: coaches, loading } = useApiItems<UserDto>("/api/Coaches");

  const options = createSelectorOptions(coaches, selectorConfigs.coach);
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
