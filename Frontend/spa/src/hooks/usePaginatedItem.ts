import { useEffect, useState, useCallback } from "react";
import {
  fetchJsonWithPagination,
  buildQueryString,
  ApiError,
} from "../lib/api";
import { useRole } from "../context/RoleContext";
import type { PaginationMetadata, QueryParameters } from "../types/api";

export interface UsePaginatedItemsOptions extends QueryParameters {
  [key: string]: any; // Allow additional filter parameters
}

export interface UsePaginatedItemsResult<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMetadata | null;
  reload: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setFilters: (filters: Record<string, any>) => void;
  updateQuery: (updates: Partial<UsePaginatedItemsOptions>) => void;
}

export function usePaginatedItems<T = any>(
  apiPath: string,
  initialOptions: UsePaginatedItemsOptions = {},
): UsePaginatedItemsResult<T> {
  const { roleLoading } = useRole();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [options, setOptions] = useState<UsePaginatedItemsOptions>({
    page: 1,
    pageSize: 10,
    ...initialOptions,
  });
  const [reloadKey, setReloadKey] = useState(0);

  const fetchData = useCallback(async () => {
    if (roleLoading) {
      setLoading(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryString = buildQueryString(options);
      const url = `${apiPath}${queryString}`;

      const response = await fetchJsonWithPagination<any>(url);

      // Handle different response shapes
      let data: T[] = [];
      let paginationMetadata: PaginationMetadata | null = null;
      const responseData = response.data;

      if (Array.isArray(responseData)) {
        data = responseData;
      } else if (responseData?.items && Array.isArray(responseData.items)) {
        data = responseData.items;
        // Extract pagination metadata from the same level as items
        paginationMetadata = {
          totalCount: responseData.totalCount || 0,
          currentPage: responseData.page || 1,
          pageSize: responseData.pageSize || 10,
          totalPages: responseData.totalPages || 0,
          hasNext: responseData.hasNextPage || false,
          hasPrevious: responseData.hasPreviousPage || false,
          nextPage: responseData.nextPage || null,
          previousPage: responseData.previousPage || null,
        };
      } else if (
        responseData?.data?.items &&
        Array.isArray(responseData.data.items)
      ) {
        data = responseData.data.items;
        // Extract pagination metadata from responseData.data
        const paginationSource = responseData.data;
        paginationMetadata = {
          totalCount: paginationSource.totalCount || 0,
          currentPage: paginationSource.page || 1,
          pageSize: paginationSource.pageSize || 10,
          totalPages: paginationSource.totalPages || 0,
          hasNext: paginationSource.hasNextPage || false,
          hasPrevious: paginationSource.hasPreviousPage || false,
          nextPage: paginationSource.nextPage || null,
          previousPage: paginationSource.previousPage || null,
        };
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        data = responseData.data;
      }

      setItems(data);
      setPagination(paginationMetadata || response.pagination || null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : String(e));
      setItems([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [apiPath, options, roleLoading, reloadKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setPage = useCallback((page: number) => {
    setOptions((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setOptions((prev) => ({ ...prev, pageSize, page: 1 })); // Reset to first page when changing page size
  }, []);

  const setFilters = useCallback((filters: Record<string, any>) => {
    setOptions((prev) => ({ ...prev, ...filters, page: 1 })); // Reset to first page when filtering
  }, []);

  const updateQuery = useCallback(
    (updates: Partial<UsePaginatedItemsOptions>) => {
      setOptions((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const reload = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  return {
    items,
    loading,
    error,
    pagination,
    reload,
    setPage,
    setPageSize,
    setFilters,
    updateQuery,
  };
}

// Backward compatibility hook that maintains the same interface as useApiItems
export function useApiItems<T = any>(apiPath: string) {
  const result = usePaginatedItems<T>(apiPath, { pageSize: 1000 }); // Use large page size for "all items"

  return {
    items: result.items,
    loading: result.loading,
    error: result.error,
    reload: result.reload,
  };
}
