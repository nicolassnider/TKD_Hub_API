import React from "react";

type ManageAssistanceModalContainerProps = {
  children: React.ReactNode;
};

const ManageAssistanceModalContainer: React.FC<
  ManageAssistanceModalContainerProps
> = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-full w-full sm:w-[400px] max-h-[90vh] flex flex-col gap-4 overflow-y-auto relative">
      {children}
    </div>
  </div>
);

export default ManageAssistanceModalContainer;
