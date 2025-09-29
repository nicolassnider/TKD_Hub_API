import React from "react";
import ApiList from "../components/common/ApiList";

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <ApiList apiPath="/api/Dashboards" titleField="name" />
    </div>
  );
}
