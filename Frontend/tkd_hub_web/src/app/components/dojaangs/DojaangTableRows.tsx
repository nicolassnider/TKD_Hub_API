import React from "react";

type Dojaang = {
  id: number;
  name: string;
  coachName?: string;
};

type Props = {
  dojaangs: Dojaang[];
  role: string;
  setEditId: (id: number) => void;
  setDeleteId: (id: number) => void;
};

export default function DojaangTableRows({ dojaangs, role, setEditId, setDeleteId }: Props) {
  return (
    <>
      {dojaangs.map((d) => (
        <tr key={d.id} className="bg-white hover:bg-blue-50 transition-colors border-b last:border-b-0">
          <td className="px-4 py-2">{d.id}</td>
          <td className="px-4 py-2">{d.name}</td>
          <td className="px-4 py-2">{d.coachName ?? <span className="text-gray-400">-</span>}</td>
          <td className="px-4 py-2">
            <div className="flex flex-row gap-2">
              <button
                className="flex items-center justify-center px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={() => setEditId(d.id)}
                title="Details"
                aria-label="Edit Dojaang"
                type="button"
              >
                <i className="bi bi-info-circle"></i>
              </button>
              {role === "Admin" && (
                <button
                  className="flex items-center justify-center px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                  onClick={() => setDeleteId(d.id)}
                  title="Delete"
                  aria-label="Delete Dojaang"
                  type="button"
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
