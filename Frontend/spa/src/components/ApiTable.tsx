import React, { useMemo, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";

type Column = {
  key: string;
  label?: string;
  render?: (row: any) => React.ReactNode;
  sortable?: boolean;
};

type Props = {
  rows: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
};

function stableString(v: any) {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.toLowerCase();
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

export default function ApiTable({
  rows,
  columns,
  onRowClick,
  pageSizeOptions = [5, 10, 25],
  defaultPageSize = 10,
}: Props) {
  const navigate = useNavigate();
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const sorted = useMemo(() => {
    if (!orderBy) return rows;
    const col = columns.find((c) => c.key === orderBy);
    if (!col) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = stableString(col.render ? String(col.render(a)) : a[orderBy]);
      const vb = stableString(col.render ? String(col.render(b)) : b[orderBy]);
      if (va < vb) return orderDir === "asc" ? -1 : 1;
      if (va > vb) return orderDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, orderBy, orderDir, columns]);

  const paged = useMemo(() => {
    const start = page * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (orderBy === key) setOrderDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setOrderBy(key);
      setOrderDir("asc");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((c) => (
              <TableCell key={c.key}>
                {c.sortable ? (
                  <TableSortLabel
                    active={orderBy === c.key}
                    direction={orderDir}
                    onClick={() => handleSort(c.key, !!c.sortable)}
                  >
                    {c.label ?? c.key}
                  </TableSortLabel>
                ) : (
                  (c.label ?? c.key)
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paged.map((r, idx) => (
            <TableRow
              key={r.id ?? idx}
              hover
              style={{ cursor: onRowClick || r.id ? "pointer" : "default" }}
              onClick={() => {
                if (onRowClick) return onRowClick(r);
                if (r.id) return navigate(`${String(r.id)}`);
              }}
            >
              {columns.map((c) => (
                <TableCell key={c.key}>
                  {c.render
                    ? c.render(r)
                    : r[c.key] !== undefined
                      ? String(r[c.key])
                      : ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => {
          setPageSize(Number(e.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={pageSizeOptions}
      />
    </TableContainer>
  );
}
