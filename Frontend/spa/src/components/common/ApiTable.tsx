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
import Box from "@mui/material/Box";
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
  onRowSelect?: (row: any) => void;
  selectedRowId?: string | number | null;
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
  onRowSelect,
  selectedRowId,
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
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 3,
        backgroundColor: "#1e1e1e",
        border: "1px solid rgba(255, 107, 53, 0.2)",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      <TableContainer
        sx={{
          flexGrow: 1,
          overflow: "auto",
          maxHeight: { xs: "60vh", md: "70vh" },
          "&::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(45deg, #ff6b35, #2196f3)",
            borderRadius: 4,
            "&:hover": {
              background: "linear-gradient(45deg, #ff8a65, #42a5f5)",
            },
          },
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: { xs: 600, md: 650 },
            tableLayout: { md: "fixed" },
          }}
        >
          <TableHead
            sx={{
              "& .MuiTableCell-head": {
                background:
                  "linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(33, 150, 243, 0.15))",
                backdropFilter: "blur(8px)",
                fontWeight: 700,
                color: "#ff6b35",
                borderBottom: "2px solid rgba(255, 107, 53, 0.4)",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                py: { xs: 1.5, sm: 2 },
                px: { xs: 1, sm: 2 },
                position: "sticky",
                top: 0,
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)",
              },
            }}
          >
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
                selected={
                  selectedRowId !== undefined && selectedRowId !== null
                    ? selectedRowId === (r.id ?? idx)
                    : false
                }
                sx={{
                  cursor:
                    onRowClick || onRowSelect || r.id ? "pointer" : "default",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: { xs: 0, md: 1 },
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 53, 0.12)",
                    transform:
                      onRowClick || onRowSelect || r.id
                        ? "translateY(-1px)"
                        : "none",
                    boxShadow:
                      onRowClick || onRowSelect || r.id
                        ? "0 4px 16px rgba(255, 107, 53, 0.2)"
                        : "none",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255, 107, 53, 0.15)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 107, 53, 0.20)",
                    },
                  },
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 1, sm: 2 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    wordBreak: "break-word",
                    maxWidth: { xs: "150px", sm: "none" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
                onClick={() => {
                  if (onRowClick) return onRowClick(r);
                  if (onRowSelect) return onRowSelect(r);
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
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          background:
            "linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(33, 150, 243, 0.05))",
          backdropFilter: "blur(8px)",
        }}
      >
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
          sx={{
            color: "rgba(255, 255, 255, 0.87)",
            "& .MuiTablePagination-toolbar": {
              minHeight: { xs: 40, sm: 52 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
              gap: { xs: 1, sm: 0 },
            },
            "& .MuiTablePagination-selectLabel": {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              margin: 0,
            },
            "& .MuiTablePagination-displayedRows": {
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              margin: 0,
            },
            "& .MuiTablePagination-select": {
              color: "white",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
            "& .MuiIconButton-root": {
              color: "rgba(255, 255, 255, 0.7)",
              padding: { xs: "6px", sm: "8px" },
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 107, 53, 0.15)",
                color: "#ff6b35",
                transform: "scale(1.1)",
              },
              "&.Mui-disabled": {
                color: "rgba(255, 255, 255, 0.3)",
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
}
