import React from "react";

type ManageAssistanceModalHeaderProps = {
  classId: number | null;
  lastClassInfo: string | null;
};

const ManageAssistanceModalHeader: React.FC<
  ManageAssistanceModalHeaderProps
> = ({ classId, lastClassInfo }) => (
  <div className="flex flex-col gap-2">
    <h2 className="text-lg font-semibold mb-2 text-neutral-100">
      Manage Assistance
    </h2>
    <p className="text-sm text-neutral-400">Class ID: {classId}</p>
    <div>
      <strong className="text-neutral-100">Last Class:</strong>{" "}
      {lastClassInfo ?? <span className="text-neutral-500">Loading...</span>}
    </div>
  </div>
);

export default ManageAssistanceModalHeader;
