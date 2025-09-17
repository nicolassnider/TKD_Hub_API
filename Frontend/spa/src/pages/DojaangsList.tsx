import ApiTable from "components/ApiTable";
import { useApiItems } from "components/useApiItems";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function DojaangsList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dojaangs</h2>
      <DojaangsTable />
    </div>
  );
}

function DojaangsTable() {
  const { items, loading, error, reload } = useApiItems("/api/Dojaangs");
  const navigate = useNavigate();
  const cols = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "address", label: "Address" },
  ];
  if (loading) return <div>Loading table</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div>
      <div className="mb-3">
        <Button variant="outlined" size="small" onClick={() => reload()}>
          Refresh
        </Button>
      </div>
      <ApiTable
        rows={items}
        columns={cols}
        onRowClick={(r) => navigate(`/dojaangs/${r.id}`)}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
      />
    </div>
  );
}
