import { useState } from "react";
import { CreatePromotionDto } from "../types/api";

interface UsePromotionFormOptions {
  onSuccess?: () => void;
}

export function usePromotionForm(options: UsePromotionFormOptions = {}) {
  const [promotionFormOpen, setPromotionFormOpen] = useState(false);
  const [studentForPromotion, setStudentForPromotion] = useState<any>(null);

  const openPromotionForm = (student?: any) => {
    if (student) {
      setStudentForPromotion(student);
    }
    setPromotionFormOpen(true);
  };

  const closePromotionForm = () => {
    setPromotionFormOpen(false);
    setStudentForPromotion(null);
  };

  const handlePromotionSubmit = async (promotionData: CreatePromotionDto) => {
    try {
      const response = await fetch("/api/Promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promotionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create promotion");
      }

      closePromotionForm();

      // Call success callback if provided
      if (options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error("Error creating promotion:", error);
      throw error;
    }
  };

  return {
    promotionFormOpen,
    studentForPromotion,
    openPromotionForm,
    closePromotionForm,
    handlePromotionSubmit,
  };
}
