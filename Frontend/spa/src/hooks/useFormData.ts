import { useState, useEffect, useMemo } from "react";
import { fetchJson } from "../lib/api";

// Shared interfaces - move these to a separate types file in the future
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  currentRankId?: number;
  currentRankName?: string;
}

export interface Coach {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Dojaang {
  id: number;
  name: string;
}

export interface Rank {
  id: number;
  name: string;
  color?: string;
  level?: number;
  order?: number;
}

// Generic hook for fetching API data
function useApiData<T>(endpoint: string, shouldFetch: boolean = true) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldFetch) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchJson<T[]>(endpoint);
        setData(fetchedData);
      } catch (err) {
        setError(`Error fetching ${endpoint}: ${err}`);
        console.error(`Error fetching ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, shouldFetch]);

  return { data, loading, error, setData };
}

// Specific hooks for each resource type
export function useStudents(shouldFetch: boolean = true) {
  return useApiData<Student>("/api/Students", shouldFetch);
}

export function useCoaches(shouldFetch: boolean = true) {
  return useApiData<Coach>("/api/Coaches", shouldFetch);
}

export function useDojaangs(shouldFetch: boolean = true) {
  return useApiData<Dojaang>("/api/Dojaangs", shouldFetch);
}

export function useRanks(shouldFetch: boolean = true) {
  return useApiData<Rank>("/api/Ranks", shouldFetch);
}

// Combined hook for forms that need multiple resources
export function useFormData(
  options: {
    includeStudents?: boolean;
    includeCoaches?: boolean;
    includeDojaangs?: boolean;
    includeRanks?: boolean;
  } = {},
) {
  const {
    includeStudents = false,
    includeCoaches = false,
    includeDojaangs = false,
    includeRanks = false,
  } = options;

  const studentsResult = useStudents(includeStudents);
  const coachesResult = useCoaches(includeCoaches);
  const dojaangsResult = useDojaangs(includeDojaangs);
  const ranksResult = useRanks(includeRanks);

  const loading =
    (includeStudents && studentsResult.loading) ||
    (includeCoaches && coachesResult.loading) ||
    (includeDojaangs && dojaangsResult.loading) ||
    (includeRanks && ranksResult.loading);

  const error =
    studentsResult.error ||
    coachesResult.error ||
    dojaangsResult.error ||
    ranksResult.error;

  return {
    students: includeStudents ? studentsResult.data : [],
    coaches: includeCoaches ? coachesResult.data : [],
    dojaangs: includeDojaangs ? dojaangsResult.data : [],
    ranks: includeRanks ? ranksResult.data : [],
    loading,
    error,
  };
}
