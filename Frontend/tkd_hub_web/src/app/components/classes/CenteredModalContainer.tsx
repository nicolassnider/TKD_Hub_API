import React from "react";

type CenteredModalContainerProps = {
  children: React.ReactNode;
};

const CenteredModalContainer: React.FC<CenteredModalContainerProps> = ({
  children,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg p-6 min-w-[320px] max-w-full w-full sm:w-[400px] max-h-[90vh] flex flex-col gap-4 overflow-y-auto relative border border-neutral-200 dark:border-neutral-700">
      {children}
    </div>
  </div>
);

export default CenteredModalContainer;
