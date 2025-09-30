// Utility functions for working with selector components
import {
  SelectorOption,
  SelectorConfig,
  LabelFormatter,
} from "../types/selectors";
import { ID } from "../types/api";

/**
 * Creates selector options from an array of data items
 */
export function createSelectorOptions<T extends Record<string, any>>(
  items: T[],
  config: SelectorConfig<T>,
): SelectorOption[] {
  return items.map((item) => ({
    id: item[config.idField] as ID,
    label: config.labelFormatter(item),
    value: config.valueField ? item[config.valueField] : item,
    disabled: config.disabledField
      ? Boolean(item[config.disabledField])
      : false,
  }));
}

/**
 * Finds a selector option by ID
 */
export function findSelectorOption(
  options: SelectorOption[],
  id: ID | null | undefined,
): SelectorOption | null {
  if (id === null || id === undefined) return null;
  return options.find((option) => option.id === id) ?? null;
}

/**
 * Common label formatters for different entity types
 */
export const labelFormatters = {
  /**
   * Formats a user's display name (firstName lastName, fallback to email or ID)
   */
  userFullName: (user: {
    id: ID;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  }): string => {
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    return fullName || user.email || `#${user.id}`;
  },

  /**
   * Formats name property or fallback to ID
   */
  nameOrId: <T extends { id: ID; name?: string | null }>(item: T): string => {
    return item.name || `#${item.id}`;
  },

  /**
   * Formats email or fallback to ID
   */
  emailOrId: <T extends { id: ID; email?: string | null }>(item: T): string => {
    return item.email || `#${item.id}`;
  },

  /**
   * Simple ID formatter
   */
  idOnly: <T extends { id: ID }>(item: T): string => {
    return String(item.id);
  },
};

/**
 * Pre-configured selector configs for common entity types
 */
export const selectorConfigs = {
  /**
   * Configuration for coach/user selectors
   */
  coach: {
    idField: "id" as const,
    labelFormatter: labelFormatters.userFullName,
  } satisfies SelectorConfig<{
    id: ID;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  }>,

  /**
   * Configuration for dojaang selectors
   */
  dojaang: {
    idField: "id" as const,
    labelFormatter: labelFormatters.nameOrId,
  } satisfies SelectorConfig<{ id: ID; name?: string | null }>,

  /**
   * Configuration for rank selectors
   */
  rank: {
    idField: "id" as const,
    labelFormatter: labelFormatters.nameOrId,
  } satisfies SelectorConfig<{ id: ID; name?: string | null }>,
};
