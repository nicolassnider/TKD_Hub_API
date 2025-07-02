import React from "react";
import NotFoundTableRow from "./NotFoundTableRow";

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
          className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition duration-200"
        >
          {columns.map((col, cidx) => (
            <td
              key={cidx}
              className={`px-4 py-3 ${
                col.className ?? "text-left"
              } text-neutral-900 dark:text-neutral-100`}
            >
              {col.render(item)}
            </td>
          ))}
          {actions && (
            <td className="px-4 py-3 text-right text-neutral-900 dark:text-neutral-100">
              {actions(item)}
            </td>
          )}
        </tr>
      ))}
    </>
  );
}

export default TableRows;
