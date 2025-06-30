import React from "react";
import NotFoundTableRow from "../NotFoundTableRow";

export type TableColumn<T> = {
  label: string;
  render: (item: T) => React.ReactNode;
  className?: string;
};

type TableRowsProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  actions?: (item: T) => React.ReactNode;
  colSpan?: number;
  notFoundMessage?: string;
};

function TableRows<T>({
  data,
  columns,
  actions,
  colSpan,
  notFoundMessage = "No records found.",
}: TableRowsProps<T>) {
  if (!data.length) {
    return (
      <NotFoundTableRow
        colSpan={colSpan ?? columns.length + (actions ? 1 : 0)}
        message={notFoundMessage}
      />
    );
  }

  return (
    <>
      {data.map((item, idx) => (
        <tr
          key={idx}
          className="border-b hover:bg-gray-100 transition duration-200"
        >
          {columns.map((col, cidx) => (
            <td
              key={cidx}
              className={`px-4 py-3 ${col.className ?? "text-left"}`}
            >
              {col.render(item)}
            </td>
          ))}
          {actions && <td className="px-4 py-3 text-right">{actions(item)}</td>}
        </tr>
      ))}
    </>
  );
}

export default TableRows;
