import React from "react";
import PromotionForm from "./PromotionForm";
import { CreatePromotionDto } from "../types/api";

interface PromotionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (promotionData: CreatePromotionDto) => Promise<void>;
  student?: {
    id: number;
    firstName?: string;
    lastName?: string;
  } | null;
  preselectedStudentId?: number;
}

export default function PromotionFormDialog({
  open,
  onClose,
  onSubmit,
  student,
  preselectedStudentId,
}: PromotionFormDialogProps) {
  const getTitle = () => {
    if (student?.firstName && student?.lastName) {
      return `Add Promotion for ${student.firstName} ${student.lastName}`;
    }
    return "Add Promotion";
  };

  const getStudentId = () => {
    return preselectedStudentId || student?.id;
  };

  return (
    <PromotionForm
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={null}
      title={getTitle()}
      preselectedStudentId={getStudentId()}
    />
  );
}
