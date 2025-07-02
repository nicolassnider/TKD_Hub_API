import React from "react";
import ModalCloseButton from "../actionButtons/ModalCloseButton";

type EditModalProps = {
  open: boolean;
  title: string;
  saving?: boolean;
  onClose: (refresh?: boolean) => void;
  children: React.ReactNode;
};

export const EditModal: React.FC<EditModalProps> = ({
  open,
  title,
  saving = false,
  onClose,
  children,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-lg relative flex flex-col max-h-[90vh]">
        <ModalCloseButton onClick={() => onClose(false)} disabled={saving} />
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center text-neutral-900 dark:text-neutral-100 px-6 pt-6">
          {title}
        </h3>
        <div
          className="overflow-y-auto px-6 pb-6"
          style={{ flex: 1, minHeight: 0 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
