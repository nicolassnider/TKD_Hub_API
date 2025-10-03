import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { Add as AddIcon, FilterList as FilterIcon } from "@mui/icons-material";
import { PaginatedTable } from "../../components/common/PaginatedTable";
import { usePaginatedItems } from "../../hooks/usePaginatedItems";
import type {
  StudentFilterParameters,
  UserDto,
  DojaangDto,
  RankDto,
} from "../../types/api";

const INITIAL_FILTERS: StudentFilterParameters = {
  page: 1,
  pageSize: 10,
  searchTerm: "",
  isActive: undefined,
  dojaangId: undefined,
  rankId: undefined,
  sortBy: "lastName",
  sortDirection: "asc",
};

export default function StudentManagement() {
  const [filters, setFilters] =
    useState<StudentFilterParameters>(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for dropdowns - in real app, these would come from API
  const dojaangs: DojaangDto[] = [];
  const ranks: RankDto[] = [];

  const {
    items: students,
    loading,
    error,
    pagination,
    setPage,
    setPageSize,
    updateQuery,
    reload,
  } = usePaginatedItems<UserDto>("/api/Students", filters);

  const handleFilterChange = (newFilters: Partial<StudentFilterParameters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    updateQuery(updatedFilters);
  };

  const handleSortChange = (sortBy: string, sortDirection: "asc" | "desc") => {
    handleFilterChange({ sortBy, sortDirection });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
    setPageSize(pageSize);
  };

  const clearFilters = () => {
    const clearedFilters = { ...INITIAL_FILTERS };
    setFilters(clearedFilters);
    updateQuery(clearedFilters);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.isActive !== undefined) count++;
    if (filters.dojaangId) count++;
    if (filters.rankId) count++;
    return count;
  }, [filters]);

  const columns = [
    {
      key: "lastName",
      label: "Last Name",
      sortable: true,
    },
    {
      key: "firstName",
      label: "First Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "phoneNumber",
      label: "Phone",
    },
    {
      key: "dojaangName",
      label: "Dojang",
      sortable: true,
    },
    {
      key: "currentRankName",
      label: "Rank",
      render: (student: UserDto) =>
        student.currentRankName ? (
          <Chip label={student.currentRankName} size="small" color="primary" />
        ) : null,
    },
    {
      key: "isActive",
      label: "Status",
      render: (student: UserDto) => (
        <Chip
          label={student.isActive ? "Active" : "Inactive"}
          color={student.isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Management
      </Typography>

      {/* Header Actions */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 1 }}
          >
            Filters
            {activeFilterCount > 0 && (
              <Chip
                label={activeFilterCount}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button onClick={clearFilters} size="small">
              Clear Filters
            </Button>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            /* TODO: Open create modal */
          }}
        >
          Add Student
        </Button>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Search"
                  placeholder="Name, email, phone..."
                  value={filters.searchTerm || ""}
                  onChange={(e) =>
                    handleFilterChange({ searchTerm: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.isActive ?? ""}
                    label="Status"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange({
                        isActive: value === "" ? undefined : value === "true",
                      });
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Dojang</InputLabel>
                  <Select
                    value={filters.dojaangId || ""}
                    label="Dojang"
                    onChange={(e) =>
                      handleFilterChange({
                        dojaangId: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  >
                    <MenuItem value="">All Dojaangs</MenuItem>
                    {dojaangs.map((dojang) => (
                      <MenuItem key={dojang.id} value={dojang.id}>
                        {dojang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Rank</InputLabel>
                  <Select
                    value={filters.rankId || ""}
                    label="Rank"
                    onChange={(e) =>
                      handleFilterChange({
                        rankId: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  >
                    <MenuItem value="">All Ranks</MenuItem>
                    {ranks.map((rank) => (
                      <MenuItem key={rank.id} value={rank.id}>
                        {rank.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Pagination Info */}
      {pagination && !loading && (
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(
              pagination.currentPage * pagination.pageSize,
              pagination.totalCount,
            )}{" "}
            of {pagination.totalCount} students
          </Typography>
        </Box>
      )}

      {/* Data Table */}
      <PaginatedTable
        rows={students}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        serverSide={true}
        emptyMessage="No students found"
        pageSizeOptions={[5, 10, 25, 50, 100]}
        onRowClick={(student) => {
          // TODO: Navigate to student detail or open edit modal
          console.log("Clicked student:", student);
        }}
      />
    </Box>
  );
}
