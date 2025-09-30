// Shared interfaces for selector components across the application
import { ID } from "./api";

/**
 * Generic option interface for dropdown/autocomplete selectors
 */
export interface SelectorOption {
  id: ID;
  label: string;
  value?: any; // Optional additional value field
  disabled?: boolean;
}

/**
 * Extended selector option with additional metadata
 */
export interface ExtendedSelectorOption extends SelectorOption {
  description?: string;
  category?: string;
  metadata?: Record<string, any>;
}

/**
 * Common props interface for selector components
 */
export interface BaseSelectorProps {
  value: ID | null | undefined;
  onChange: (id: ID | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
}

/**
 * Props for selectors with loading states
 */
export interface LoadingSelectorProps extends BaseSelectorProps {
  loading?: boolean;
}

/**
 * Props for multi-select components
 */
export interface MultiSelectorProps
  extends Omit<BaseSelectorProps, "value" | "onChange"> {
  value: ID[] | null | undefined;
  onChange: (ids: ID[]) => void;
  maxSelections?: number;
}

/**
 * Helper type for formatting display labels
 */
export type LabelFormatter<T> = (item: T) => string;

/**
 * Configuration for creating selector options from data
 */
export interface SelectorConfig<T> {
  idField: keyof T;
  labelFormatter: LabelFormatter<T>;
  valueField?: keyof T;
  disabledField?: keyof T;
}
