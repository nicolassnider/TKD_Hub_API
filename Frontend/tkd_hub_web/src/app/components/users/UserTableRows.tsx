import React from "react";
import TableActionButton from "../common/actionButtons/TableActionButton";
import NotFoundTableRow from "../common/NotFoundTableRow";

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

const UserTableRows: React.FC<UserTableRowsProps> = ({
    users = [],
    onEdit,
    onDeleted,
}) => {
    // You can add delete/reactivate logic here if needed

    if (!Array.isArray(users) || users.length === 0) {
        return <NotFoundTableRow colSpan={5} message="No users found." />;
    }

    return (
        <>
            {users.map((user) => (
                <tr key={user.id ?? Math.random()}>
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.name || "-"}</td>
                    <td className="px-4 py-2">{user.email || "-"}</td>
                    <td className="px-4 py-2">{user.role || "-"}</td>
                    <td className="px-4 py-2">
                        <div className="flex gap-2 items-center">
                            <TableActionButton
                                onClick={() => typeof user.id === "number" && onEdit(user.id)}
                                title="Edit"
                                iconClass="bi bi-pencil-square"
                                colorClass="bg-blue-600 text-white hover:bg-blue-700"
                                disabled={typeof user.id !== "number"}
                            />
                            <TableActionButton
                                onClick={() => {
                                    // Add your delete logic here, e.g. show a confirm dialog and call an API
                                    if (typeof user.id === "number" && window.confirm("Delete this user?")) {
                                        // You should call your delete function here
                                        if (onDeleted) onDeleted();
                                    }
                                }}
                                title="Delete"
                                iconClass="bi bi-trash"
                                colorClass="bg-red-600 text-white hover:bg-red-700"
                                disabled={typeof user.id !== "number"}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default UserTableRows;
