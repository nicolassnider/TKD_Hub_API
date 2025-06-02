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
        <tr key={d.id}>
          <td>{d.id}</td>
          <td>{d.name}</td>
          <td>{d.coachName ?? <span className="text-muted">-</span>}</td>
          <td>
            <div className="d-flex flex-row gap-2">
              <button
                className="btn btn-primary d-flex align-items-center justify-content-center"
                onClick={() => setEditId(d.id)}
                title="Details"
              >
                <i className="bi bi-info-circle"></i>
              </button>
              {role === "Admin" && (
                <button
                  className="btn btn-danger d-flex align-items-center justify-content-center"
                  onClick={() => setDeleteId(d.id)}
                  title="Delete"
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
