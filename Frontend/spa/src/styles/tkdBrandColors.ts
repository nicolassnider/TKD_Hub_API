// TKD Hub Brand Colors - Based on traditional Taekwondo symbolism
export const tkdBrandColors = {
  // Primary Colors (Traditional TKD Belt Colors)
  red: {
    main: "#DC2626", // Courage, determination, sacrifice
    light: "#FCA5A5",
    dark: "#B91C1C",
    contrast: "#FFFFFF",
  },
  blue: {
    main: "#2563EB", // Perseverance, wisdom, control
    light: "#93C5FD",
    dark: "#1D4ED8",
    contrast: "#FFFFFF",
  },
  black: {
    main: "#1F2937", // Maturity, honor, mastery
    light: "#6B7280",
    dark: "#111827",
    contrast: "#FFFFFF",
  },

  // Secondary Colors
  gold: {
    main: "#F59E0B", // Excellence, achievement
    light: "#FDE047",
    dark: "#D97706",
    contrast: "#1F2937",
  },
  white: {
    main: "#FFFFFF", // Purity, beginning, innocence
    light: "#FAFAFA",
    dark: "#F3F4F6",
    contrast: "#1F2937",
  },

  // Functional Colors
  success: {
    main: "#059669", // Growth, harmony, progress
    light: "#34D399",
    dark: "#047857",
    contrast: "#FFFFFF",
  },
  warning: {
    main: "#F59E0B", // Caution, focus
    light: "#FDE047",
    dark: "#D97706",
    contrast: "#1F2937",
  },
  error: {
    main: "#DC2626", // Alert, correction needed
    light: "#FCA5A5",
    dark: "#B91C1C",
    contrast: "#FFFFFF",
  },
  neutral: {
    main: "#6B7280", // Balance, neutrality
    light: "#D1D5DB",
    dark: "#4B5563",
    contrast: "#FFFFFF",
  },
};

// Status Colors for different entities
export const statusColors = {
  active: tkdBrandColors.success.main,
  inactive: tkdBrandColors.neutral.main,
  pending: tkdBrandColors.warning.main,
  completed: tkdBrandColors.blue.main,
  cancelled: tkdBrandColors.error.main,
};

// Rank Colors (Traditional belt progression)
export const rankColors = {
  white: tkdBrandColors.white.main,
  yellow: "#FEF3C7",
  orange: "#FED7AA",
  green: "#D1FAE5",
  purple: "#E9D5FF",
  blue: tkdBrandColors.blue.light,
  brown: "#D2B48C",
  red: tkdBrandColors.red.light,
  black: tkdBrandColors.black.main,
};

// Event Type Colors
export const eventTypeColors = {
  tournament: tkdBrandColors.red.main,
  seminar: tkdBrandColors.blue.main,
  training: tkdBrandColors.success.main,
  grading: tkdBrandColors.gold.main,
  social: tkdBrandColors.neutral.main,
  competition: tkdBrandColors.red.dark,
};

// Component Styling Utilities
export const tkdStyling = {
  // Chip styles for consistent brand appearance
  statusChip: (isActive: boolean) => ({
    backgroundColor: isActive ? statusColors.active : statusColors.inactive,
    color: "white",
    fontWeight: 600,
    fontSize: "0.75rem",
    "& .MuiChip-label": {
      px: 2,
    },
  }),

  // Primary action button
  primaryButton: {
    backgroundColor: tkdBrandColors.red.main,
    color: tkdBrandColors.red.contrast,
    fontWeight: 600,
    textTransform: "none" as const,
    "&:hover": {
      backgroundColor: tkdBrandColors.red.dark,
    },
  },

  // Secondary action button
  secondaryButton: {
    backgroundColor: tkdBrandColors.blue.main,
    color: tkdBrandColors.blue.contrast,
    fontWeight: 600,
    textTransform: "none" as const,
    "&:hover": {
      backgroundColor: tkdBrandColors.blue.dark,
    },
  },

  // Success action button
  successButton: {
    backgroundColor: tkdBrandColors.success.main,
    color: tkdBrandColors.success.contrast,
    fontWeight: 600,
    textTransform: "none" as const,
    "&:hover": {
      backgroundColor: tkdBrandColors.success.dark,
    },
  },

  // Page headers
  pageHeader: {
    color: tkdBrandColors.black.main,
    fontWeight: 700,
    letterSpacing: "0.05em",
  },

  // Field labels
  fieldLabel: {
    color: tkdBrandColors.black.main,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
  },

  // Important text (names, titles)
  importantText: {
    color: tkdBrandColors.black.main,
    fontWeight: 600,
  },

  // Highlighted text (coaches, instructors)
  highlightedText: {
    color: tkdBrandColors.red.main,
    fontWeight: 500,
  },
};
