import React from "react";

type NotFoundTableRowProps = {
  colSpan: number;
  message?: string;
};

const NotFoundTableRow: React.FC<NotFoundTableRowProps> = ({
  colSpan,
  message = "No records found.",
}) => (
  <tr>
    <td colSpan={colSpan} className="py-8 bg-neutral-900">
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="text-2xl text-neutral-500">
          <i className="bi bi-emoji-frown" aria-hidden="true"></i>
        </span>
        <span className="text-base sm:text-lg text-neutral-400 font-medium">
          {message}
        </span>
      </div>
    </td>
  </tr>
);

export default NotFoundTableRow;
