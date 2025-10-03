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
  PromotionFilterParameters,
  PromotionDto,
  UserDto,
  RankDto,
  DojaangDto,
} from "../../types/api";

// Simple interface for student dropdown list
interface StudentOption {
  id: number;
  name: string;
}

const INITIAL_FILTERS: PromotionFilterParameters = {
  page: 1,
  pageSize: 10,
  studentId: undefined,
  dojaangId: undefined,
  fromRankId: undefined,
  toRankId: undefined,
  fromDate: undefined,
  toDate: undefined,
  sortBy: "promotionDate",
  sortDirection: "desc",
};

export default function PromotionManagement() {
  const [filters, setFilters] =
    useState<PromotionFilterParameters>(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for dropdowns - in real app, these would come from API
  const students: StudentOption[] = [];
  const ranks: RankDto[] = [];
  const dojaangs: DojaangDto[] = [];

  const {
    items: promotions,
    loading,
    error,
    pagination,
    setPage,
    setPageSize,
    updateQuery,
    reload,
  } = usePaginatedItems<PromotionDto>("/api/Promotions", filters);

  const handleFilterChange = (
    newFilters: Partial<PromotionFilterParameters>,
  ) => {
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
    if (filters.studentId) count++;
    if (filters.dojaangId) count++;
    if (filters.fromRankId) count++;
    if (filters.toRankId) count++;
    if (filters.fromDate) count++;
    if (filters.toDate) count++;
    return count;
  }, [filters]);

  const columns = [
    {
      key: "promotionDate",
      label: "Date",
      sortable: true,
      render: (promotion: PromotionDto) =>
        new Date(promotion.promotionDate).toLocaleDateString(),
    },
    {
      key: "studentName",
      label: "Student",
      sortable: true,
    },
    {
      key: "promotion",
      label: "Promotion",
      render: (promotion: PromotionDto) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={promotion.rankName || "Unknown Rank"}
            size="small"
            color="primary"
          />
          <Typography variant="body2">Promoted</Typography>
        </Box>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      render: (promotion: PromotionDto) =>
        promotion.notes ? (
          <Typography variant="body2" noWrap title={promotion.notes}>
            {promotion.notes}
          </Typography>
        ) : null,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Promotion Management
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
          Record Promotion
        </Button>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Student</InputLabel>
                  <Select
                    value={filters.studentId || ""}
                    label="Student"
                    onChange={(e) =>
                      handleFilterChange({
                        studentId: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  >
                    <MenuItem value="">All Students</MenuItem>
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name}
                      </MenuItem>
                    ))}
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
                  <InputLabel>From Rank</InputLabel>
                  <Select
                    value={filters.fromRankId || ""}
                    label="From Rank"
                    onChange={(e) =>
                      handleFilterChange({
                        fromRankId: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  >
                    <MenuItem value="">Any Rank</MenuItem>
                    {ranks.map((rank) => (
                      <MenuItem key={rank.id} value={rank.id}>
                        {rank.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>To Rank</InputLabel>
                  <Select
                    value={filters.toRankId || ""}
                    label="To Rank"
                    onChange={(e) =>
                      handleFilterChange({
                        toRankId: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  >
                    <MenuItem value="">Any Rank</MenuItem>
                    {ranks.map((rank) => (
                      <MenuItem key={rank.id} value={rank.id}>
                        {rank.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="From Date"
                  type="date"
                  value={filters.fromDate || ""}
                  onChange={(e) =>
                    handleFilterChange({ fromDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="To Date"
                  type="date"
                  value={filters.toDate || ""}
                  onChange={(e) =>
                    handleFilterChange({ toDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
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
            of {pagination.totalCount} promotions
          </Typography>
        </Box>
      )}

      {/* Data Table */}
      <PaginatedTable
        rows={promotions}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        serverSide={true}
        emptyMessage="No promotions found"
        pageSizeOptions={[5, 10, 25, 50, 100]}
        onRowClick={(promotion) => {
          // TODO: Navigate to promotion detail or open edit modal
          console.log("Clicked promotion:", promotion);
        }}
      />
    </Box>
  );
}
