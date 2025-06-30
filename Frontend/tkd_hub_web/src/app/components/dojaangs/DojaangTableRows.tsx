import { useDojaangs } from "@/app/context/DojaangContext";
import { Dojaang } from "@/app/types/Dojaang";
import TableActionButton from "../common/actionButtons/TableActionButton";
import { useRoles } from "@/app/context/RoleContext";
import TableRows, { TableColumn } from "../common/tableRows/TableRows";

type DojaangTableRowsProps = {
  dojaangs: Dojaang[];
  onEdit: (dojaangId: number) => void;
  onRequestDelete: (dojaangId: number) => void;
};

const columns: TableColumn<Dojaang>[] = [
  {
    label: "ID",
    render: (dojaang) => dojaang.id,
  },
  {
    label: "Name",
    render: (dojaang) => dojaang.name,
  },
  {
    label: "Email",
    render: (dojaang) => dojaang.email,
  },
];

const DojaangTableRows: React.FC<DojaangTableRowsProps> = ({
  dojaangs,
  onEdit,
  onRequestDelete,
}) => {
  const { fetchDojaangs } = useDojaangs();
  const { getRole } = useRoles();
  const role = getRole();

  const handleDelete = async (id: number) => {
    await onRequestDelete(id);
    fetchDojaangs();
  };

  return (
    <TableRows
      data={dojaangs}
      columns={columns}
      actions={(dojaang) => (
        <div className="flex gap-2">
          <TableActionButton
            onClick={() => onEdit(dojaang.id)}
            title="Edit"
            iconClass="bi bi-pencil-square"
            colorClass="bg-blue-600 text-white hover:bg-blue-700"
          />
          {Array.isArray(role) && role.includes("Admin") && (
            <TableActionButton
              onClick={() => handleDelete(dojaang.id)}
              title="Delete"
              iconClass="bi bi-trash"
              colorClass="bg-red-600 text-white hover:bg-red-700"
            />
          )}
        </div>
      )}
      notFoundMessage="No dojaangs found."
    />
  );
};

export default DojaangTableRows;
