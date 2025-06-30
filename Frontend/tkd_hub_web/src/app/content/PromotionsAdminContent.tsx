"use client";

import PromotionsAdminFilters from "../components/promotions/PromotionsAdminFilters";
import PromotionsAdminModals from "../components/promotions/PromotionsAdminModals";
import PromotionsAdminTable from "../components/promotions/PromotionsAdminTable";
import { usePromotionsAdmin } from "../components/promotions/usePromotionsAdmin";

export default function PromotionsAdminContent() {
  const admin = usePromotionsAdmin();

  return (
    <admin.AdminListPage
      title="Promotions Administration"
      loading={admin.loading}
      error={admin.error}
      onCreate={() => admin.setShowCreate(true)}
      createLabel="Add Promotion"
      tableHead={<PromotionsAdminTable.Head />}
      tableBody={
        <PromotionsAdminTable.Body
          promotions={admin.promotions}
          onEdit={admin.handleEdit}
          onDelete={admin.handleDeletePrompt}
        />
      }
      filters={
        <PromotionsAdminFilters
          students={admin.students}
          studentIdFilter={admin.studentIdFilter}
          onStudentSelect={admin.handleStudentSelect}
          onClearStudent={admin.handleClearStudent}
        />
      }
      modals={
        <PromotionsAdminModals
          showCreate={admin.showCreate}
          editingPromotion={admin.editingPromotion}
          deleteId={admin.deleteId}
          loading={admin.loading}
          studentIdFilter={admin.studentIdFilter}
          onCreateClose={admin.handleCreateClose}
          onEditClose={admin.handleEditClose}
          onDelete={admin.handleDelete}
          onCancelDelete={admin.handleCancelDelete}
        />
      }
    />
  );
}
