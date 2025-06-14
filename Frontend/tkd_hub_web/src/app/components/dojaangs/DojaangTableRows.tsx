import { useDojaangs } from "@/app/context/DojaangContext";
import { Dojaang } from "@/app/types/Dojaang";
import TableActionButton from "../common/actionButtons/TableActionButton";
import { useRole } from "@/app/context/RoleContext";
import NotFoundTableRow from "../common/NotFoundTableRow";

type DojaangTableRowsProps = {
  dojaangs: Dojaang[];
  onEdit: (dojaangId: number) => void;
  onRequestDelete: (dojaangId: number) => void;
};

const DojaangTableRows: React.FC<DojaangTableRowsProps> = ({
  dojaangs,
  onEdit,
  onRequestDelete,
}) => {
  const { fetchDojaangs } = useDojaangs();
  const { getRole } = useRole();
  const role = getRole();

  const handleDelete = async (id: number) => {
    await onRequestDelete(id);
    fetchDojaangs();
  };

  if (dojaangs.length === 0) {
    return <NotFoundTableRow colSpan={4} message="No dojaangs found." />;
  }

  return (
    <>
      {dojaangs.map((dojaang) => (
        <tr key={dojaang.id}>
          <td className="px-4 py-2">{dojaang.id}</td>
          <td className="px-4 py-2">{dojaang.name}</td>
          <td className="px-4 py-2">{dojaang.email}</td>
          <td className="px-4 py-2">
            <div className="flex gap-2">
              <TableActionButton
                onClick={() => onEdit(dojaang.id)}
                title="Edit"
                iconClass="bi bi-pencil-square"
                colorClass="bg-blue-600 text-white hover:bg-blue-700"
              />
              {role === "Admin" && (
                <TableActionButton
                  onClick={() => handleDelete(dojaang.id)}
                  title="Delete"
                  iconClass="bi bi-trash"
                  colorClass="bg-red-600 text-white hover:bg-red-700"
                />
              )}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default DojaangTableRows;
