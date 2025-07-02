import React from "react";
import TableActionButton from "../common/actionButtons/TableActionButton";
import TableRows, { TableColumn } from "../common/tableRows/TableRows";

type User = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
};

type UserTableRowsProps = {
  users: User[];
  onEdit: (userId: number) => void;
  onDeleted?: () => void;
};

const columns: TableColumn<User>[] = [
  {
    label: "ID",
    render: (user) => user.id ?? "-",
  },
  {
    label: "Name",
    render: (user) => user.name || "-",
  },
  {
    label: "Email",
    render: (user) => user.email || "-",
  },
  {
    label: "Role",
    render: (user) => user.role || "-",
  },
];

const UserTableRows: React.FC<UserTableRowsProps> = ({
  users = [],
  onEdit,
  onDeleted,
}) => {
  return (
    <TableRows
      data={users}
      columns={columns}
      actions={(user) => (
        <div className="flex gap-2 items-center">
          <TableActionButton
            onClick={() => typeof user.id === "number" && onEdit(user.id)}
            title="Edit"
            iconClass="bi bi-pencil-square"
            variant="primary"
            disabled={typeof user.id !== "number"}
          />
          <TableActionButton
            onClick={() => {
              if (
                typeof user.id === "number" &&
                window.confirm("Delete this user?")
              ) {
                // You should call your delete function here
                if (onDeleted) onDeleted();
              }
            }}
            title="Delete"
            iconClass="bi bi-trash"
            variant="error"
            disabled={typeof user.id !== "number"}
          />
        </div>
      )}
      notFoundMessage="No users found."
    />
  );
};

export default UserTableRows;
