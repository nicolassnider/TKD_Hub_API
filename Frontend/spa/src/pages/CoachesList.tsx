import ApiList from "../components/ApiList";
import ApiTable from "components/ApiTable";
import { useApiItems } from "components/useApiItems";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function CoachesList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Coaches</h2>
      <div className="mt-6">
        <CoachesTable />
      </div>
    </div>
  );
}

function CoachesTable() {
  const navigate = useNavigate();
  const {
    items: rows,
    loading: tableLoading,
    error: tableError,
    reload,
  } = useApiItems("/api/Coaches");
  const cols = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "fullName",
      label: "Name",
      render: (r: any) => `${r.firstName} ${r.lastName}`,
      sortable: true,
    },
    { key: "email", label: "Email", sortable: true },
    { key: "phoneNumber", label: "Phone" },
  ];
  if (tableLoading) return <div>Loading table…</div>;
  if (tableError) return <div className="text-red-500">{tableError}</div>;
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
        onRowClick={(r) => navigate(`/coaches/${r.id}`)}
        defaultPageSize={5}
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
  );
}
