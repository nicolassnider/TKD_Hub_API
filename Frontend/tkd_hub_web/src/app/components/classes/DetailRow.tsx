import React from "react";

type DetailRowProps = {
  label: string;
  children: React.ReactNode;
};

const DetailRow: React.FC<DetailRowProps> = ({ label, children }) => (
  <div className="flex items-center py-1">
    <label className="w-32 font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </label>
    <span className="flex-1 text-neutral-900 dark:text-neutral-100">
      {children}
    </span>
  </div>
);

export default DetailRow;
