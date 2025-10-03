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
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
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
      />
    </Paper>
  );
}

export { PaginatedTable };
