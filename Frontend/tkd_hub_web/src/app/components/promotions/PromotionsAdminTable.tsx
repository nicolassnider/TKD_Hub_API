import PromotionTableRows from "@/app/components/promotions/PromotionsTableRows";
import { Promotion } from "@/app/types/Promotion";

const Head = () => (
  <tr className="bg-gray-100">
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">
      Promoted To
    </th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Options</th>
  </tr>
);

const Body = ({
  promotions,
  onEdit,
  onDelete,
}: {
  promotions: Promotion[];
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: number) => void;
}) => (
  <PromotionTableRows
    promotions={promotions}
    onEdit={onEdit}
    onDelete={onDelete}
  />
);

const PromotionsAdminTable = { Head, Body };
export default PromotionsAdminTable;
