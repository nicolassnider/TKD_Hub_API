import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson, ApiError } from "../lib/api";
import { useRole } from "../context/RoleContext";
import { useApiItems } from "../hooks/useApiItems";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

type Props = {
  apiPath: string; // e.g. /api/Students
  idField?: string;
  titleField?: string;
};

export default function ApiList({
  apiPath,
  idField = "id",
  titleField = "name",
}: Props) {
  const { items, loading, error, reload } = useApiItems(apiPath);

  if (loading)
    return (
      <div className="flex items-center gap-2">
        <CircularProgress size={20} /> Loading…
      </div>
    );
  if (error) return <Alert severity="error">Error: {error}</Alert>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div />
        <div>
          <Button size="small" onClick={() => reload()} variant="outlined">
            Refresh
          </Button>
        </div>
      </div>
      {items.length === 0 ? (
        <div>No items found.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((it: any) => (
            <li key={it[idField]} className="p-2 border rounded">
              <Link
                to={`${apiPath.replace("/api/", "/").toLowerCase()}/${it[idField]}`}
                className="text-blue-600 font-medium"
              >
                {it[titleField] ?? `${apiPath} ${it[idField]}`}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
