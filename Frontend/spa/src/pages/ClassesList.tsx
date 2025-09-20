import ApiTable from "components/ApiTable";
import { useApiItems } from "../hooks/useApiItems";

import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import React from "react";
import { TrainingClassDto } from "types/api";

export default function ClassesList() {
  return (
    <div>
      <h2 className="page-title">Classes</h2>
      <ClassesTable />
    </div>
  );
}

function ClassesTable() {
  const navigate = useNavigate();
  const {
    items: rows,
    loading,
    error,
    reload,
  } = useApiItems<TrainingClassDto>("/api/Classes");

  const weekday = (n: number) => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names[n] ?? String(n);
  };

  const cols = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    {
      key: "dojaangName",
      label: "Dojaang",
      render: (r: any) => r.dojaangName ?? "-",
    },
    {
      key: "coachName",
      label: "Coach",
      render: (r: any) => r.coachName ?? "-",
    },
    {
      key: "schedules",
      label: "Schedules",
      render: (r: any) => {
        if (!r.schedules || !Array.isArray(r.schedules)) return "-";
        // produce a plain string like "Mon 18:00-19:00, Wed 19:00-21:00"
        return r.schedules
          .map((s: any) => {
            const day = typeof s.day === "number" ? weekday(s.day) : s.day;
            const start = s.startTime ?? "";
            const end = s.endTime ? `-${s.endTime}` : "";
            return `${day} ${start}${end}`.trim();
          })
          .join(", ");
      },
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
        onRowClick={(r) => navigate(`/classes/${r.id}`)}
        defaultPageSize={5}
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
  );
}
