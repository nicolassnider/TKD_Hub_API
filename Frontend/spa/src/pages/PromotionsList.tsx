import ApiTable from "components/ApiTable";
import { useApiItems } from "components/useApiItems";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import React from "react";
import { PromotionDto } from "types/api";

export default function PromotionsList() {
  return (
    <div>
      <h2 className="page-title">Promotions</h2>
      <PromotionsTable />
    </div>
  );
}

function PromotionsTable() {
  const navigate = useNavigate();
  const {
    items: rows,
    loading,
    error,
    reload,
  } = useApiItems<PromotionDto>("/api/Promotions");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const cols = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "studentName",
      label: "Student",
      render: (r: PromotionDto) => r.studentName ?? "-",
      sortable: true,
    },
    {
      key: "rankName",
      label: "Rank",
      render: (r: PromotionDto) => r.rankName ?? "-",
      sortable: true,
    },
    {
      key: "promotionDate",
      label: "Promotion Date",
      render: (r: PromotionDto) => formatDate(r.promotionDate),
      sortable: true,
    },
    {
      key: "notes",
      label: "Notes",
      render: (r: PromotionDto) =>
        r.notes
          ? r.notes.length > 50
            ? r.notes.substring(0, 50) + "..."
            : r.notes
          : "-",
    },
  ];

  if (loading) return <div>Loading table…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-3">
        <Button variant="outlined" size="small" onClick={() => reload()}>
          Refresh
        </Button>
      </div>
      <ApiTable
        rows={rows}
        columns={cols}
        onRowClick={(r) => navigate(`/promotions/${r.id}`)}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
      />
    </div>
  );
}
