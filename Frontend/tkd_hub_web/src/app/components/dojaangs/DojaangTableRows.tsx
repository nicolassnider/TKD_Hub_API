import { useDojaangs } from "@/app/context/DojaangContext";
import { Dojaang } from "@/app/types/Dojaang";

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
  const { refreshDojaangs } = useDojaangs();

  const handleDelete = async (id: number) => {
    await onRequestDelete(id);
    refreshDojaangs();
  };

  return (
    <>
      {dojaangs.map((dojaang) => (
        <tr key={dojaang.id}>
          <td className="px-4 py-2">{dojaang.id}</td>
          <td className="px-4 py-2">{dojaang.name}</td>
          <td className="px-4 py-2">{dojaang.email}</td>
          <td className="px-4 py-2 flex gap-2">
            <button
              className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => onEdit(dojaang.id)}
              title="Edit"
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button
              className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={() => handleDelete(dojaang.id)}
              title="Delete"
            >
              <i className="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default DojaangTableRows;
