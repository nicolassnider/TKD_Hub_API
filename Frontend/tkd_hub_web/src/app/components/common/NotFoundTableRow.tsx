import React from "react";

type NotFoundTableRowProps = {
  colSpan: number;
  message?: string;
};

const NotFoundTableRow: React.FC<NotFoundTableRowProps> = ({ colSpan, message = "No records found." }) => (
  <tr>
    <td colSpan={colSpan} className="text-center text-gray-500 py-3">
      {message}
    </td>
  </tr>
);

export default NotFoundTableRow;
