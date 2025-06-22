"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type DashboardWidgetsProps = {
  data: Record<string, unknown>;
};

const DashboardWidgets = ({ data }: DashboardWidgetsProps) => {
  // Prepare chart data for widgets that are numeric
  const chartData = Object.entries(data)
    .filter(([_, value]) => typeof value === "number")
    .map(([key, value]) => ({
      name: key,
      value: value as number,
    }));

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Show chart if there are numeric widgets */}
      {chartData.length > 0 && (
        <div className="w-full h-64 bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Widget Overview</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Show raw values for all widgets */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Widget Values</h3>
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key} className="mb-1">
              <span className="font-medium">{key}:</span> {String(value)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardWidgets;
