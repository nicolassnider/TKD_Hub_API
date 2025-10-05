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
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import type { PaginationMetadata } from "../../types/api";

type Column<T> = {
  key: string;
  label?: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  pagination?: PaginationMetadata | null;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sortBy: string, sortDirection: "asc" | "desc") => void;
  onRowClick?: (row: T) => void;
  onRowSelect?: (row: T) => void;
  selectedRowId?: string | number | null;
  pageSizeOptions?: number[];
  serverSide?: boolean;
  emptyMessage?: string;
};

export default function PaginatedTable<T extends Record<string, any>>({
  rows,
  columns,
  loading = false,
  error = null,
  pagination = null,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onRowClick,
  onRowSelect,
  selectedRowId,
  pageSizeOptions = [5, 10, 25, 50],
  serverSide = false,
  emptyMessage = "No data available",
}: Props<T>) {
  const navigate = useNavigate();
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");

  // Client-side pagination state (only used when serverSide = false)
  const [clientPage, setClientPage] = useState(0);
  const [clientPageSize, setClientPageSize] = useState(
    pageSizeOptions[1] || 10,
  );

  // Handle sorting
  const handleSort = (column: string) => {
    const isAsc = orderBy === column && orderDir === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setOrderBy(column);
    setOrderDir(newDirection);

    if (serverSide && onSortChange) {
      onSortChange(column, newDirection);
    }
  };

  // Handle pagination changes
  const handlePageChange = (_: any, newPage: number) => {
    if (serverSide) {
      onPageChange?.(newPage + 1); // Server uses 1-based pagination
    } else {
      setClientPage(newPage);
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    if (serverSide) {
      onPageSizeChange?.(newPageSize);
    } else {
      setClientPageSize(newPageSize);
      setClientPage(0);
    }
  };

  // Process data for display (client-side sorting and pagination)
  const processedData = useMemo(() => {
    if (serverSide) {
      return rows; // Server handles everything
    }

    let sortedRows = [...rows];

    // Client-side sorting
    if (orderBy) {
      sortedRows = [...sortedRows].sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];

        if (aVal === bVal) return 0;

        const comparison = aVal < bVal ? -1 : 1;
        return orderDir === "asc" ? comparison : -comparison;
      });
    }

    // Client-side pagination
    const startIndex = clientPage * clientPageSize;
    return sortedRows.slice(startIndex, startIndex + clientPageSize);
  }, [rows, orderBy, orderDir, clientPage, clientPageSize, serverSide]);

  // Get pagination info
  const totalCount = serverSide ? pagination?.totalCount || 0 : rows.length;

  const currentPage = serverSide
    ? (pagination?.currentPage || 1) - 1 // Convert to 0-based
    : clientPage;

  const currentPageSize = serverSide
    ? pagination?.pageSize || pageSizeOptions[0]
    : clientPageSize;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          flexDirection: "column",
          gap: 2,
          p: 4,
        }}
      >
        <CircularProgress size={40} thickness={4} sx={{ color: "#ff6b35" }} />
        <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
          Loading data...
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          borderRadius: 2,
          backgroundColor: "rgba(211, 47, 47, 0.1)",
          border: "1px solid rgba(211, 47, 47, 0.3)",
        }}
      >
        {error}
      </Alert>
    );
  }

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
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? orderDir : "asc"}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label || column.key}
                    </TableSortLabel>
                  ) : (
                    column.label || column.key
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {processedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((row, idx) => (
                <TableRow
                  key={row.id ?? idx}
                  hover
                  selected={
                    selectedRowId !== undefined && selectedRowId !== null
                      ? selectedRowId === (row.id ?? idx)
                      : false
                  }
                  sx={{
                    cursor:
                      onRowClick || onRowSelect || row.id
                        ? "pointer"
                        : "default",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: { xs: 0, md: 1 },
                    "&:hover": {
                      backgroundColor: "rgba(255, 107, 53, 0.12)",
                      transform:
                        onRowClick || onRowSelect || row.id
                          ? "translateY(-1px)"
                          : "none",
                      boxShadow:
                        onRowClick || onRowSelect || row.id
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
                    if (onRowClick) onRowClick(row);
                    if (onRowSelect) onRowSelect(row);
                    if (row.id) navigate(`${String(row.id)}`);
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(row)
                        : row[column.key] !== undefined
                          ? String(row[column.key])
                          : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
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
          rowsPerPageOptions={pageSizeOptions}
          component="div"
          count={totalCount}
          rowsPerPage={currentPageSize}
          page={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          showFirstButton
          showLastButton
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

export { PaginatedTable };
