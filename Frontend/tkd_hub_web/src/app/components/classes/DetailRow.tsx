import React from "react";

type DetailRowProps = {
  label: string;
  children: React.ReactNode;
};

const DetailRow: React.FC<DetailRowProps> = ({ label, children }) => (
  <div className="flex items-center">
    <label className="w-28 font-semibold">{label}</label>
    <span className="flex-1">{children}</span>
  </div>
);

export default DetailRow;
