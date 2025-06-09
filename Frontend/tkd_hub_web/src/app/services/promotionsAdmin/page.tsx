import PromotionsAdminContent from "@/app/content/PromotionsAdminContent";
import { Suspense } from "react";

export default function PromotionsAdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromotionsAdminContent />
    </Suspense>
  );
}
