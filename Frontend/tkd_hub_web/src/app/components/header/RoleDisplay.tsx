type RoleDisplayProps = {
  role: string[] | undefined;
};

const RoleDisplay = ({ role }: RoleDisplayProps) => (
  <span className="text-sm text-gray-300">
    Role:{" "}
    <span className="font-semibold">
      {Array.isArray(role) && role.length > 0 ? role.join(", ") : "Guest"}
    </span>
  </span>
);

export default RoleDisplay;
