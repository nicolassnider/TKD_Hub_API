export type ServiceRoute = {
  href: string;
  icon: string;
  label: string;
  roles?: string[]; // Array of roles that can access this route
};
