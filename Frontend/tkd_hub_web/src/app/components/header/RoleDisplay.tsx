type RoleDisplayProps = {
  role: string[] | undefined;
};

const RoleDisplay = ({ role }: RoleDisplayProps) => (
  <span className="text-sm text-neutral-300 dark:text-neutral-400">
    Role:{" "}
    <span className="font-semibold text-neutral-100 dark:text-neutral-50">
      {Array.isArray(role) && role.length > 0 ? role.join(", ") : "Guest"}
    </span>
  </span>
);

export default RoleDisplay;
