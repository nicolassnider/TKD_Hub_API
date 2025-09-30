import { useState, useEffect, useMemo } from "react";
import { fetchJson } from "../lib/api";
import { UserDto, DojaangDto, Rank } from "../types/api";

// Type aliases for cleaner usage in this hook
type Student = UserDto; // UserDto contains all student information
type Coach = UserDto; // UserDto contains all coach information
type Dojaang = DojaangDto;

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
  return useApiData<Coach>("/api/coaches", shouldFetch);
}

export function useDojaangs(shouldFetch: boolean = true) {
  return useApiData<Dojaang>("/api/dojaangs", shouldFetch);
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

  const loading = useMemo(
    () =>
      (includeStudents && studentsResult.loading) ||
      (includeCoaches && coachesResult.loading) ||
      (includeDojaangs && dojaangsResult.loading) ||
      (includeRanks && ranksResult.loading),
    [
      includeStudents,
      studentsResult.loading,
      includeCoaches,
      coachesResult.loading,
      includeDojaangs,
      dojaangsResult.loading,
      includeRanks,
      ranksResult.loading,
    ],
  );

  const error = useMemo(
    () =>
      studentsResult.error ||
      coachesResult.error ||
      dojaangsResult.error ||
      ranksResult.error,
    [
      studentsResult.error,
      coachesResult.error,
      dojaangsResult.error,
      ranksResult.error,
    ],
  );

  // Memoize the returned arrays to prevent unnecessary re-renders
  const students = useMemo(
    () => (includeStudents ? studentsResult.data : []),
    [includeStudents, studentsResult.data],
  );

  const coaches = useMemo(
    () => (includeCoaches ? coachesResult.data : []),
    [includeCoaches, coachesResult.data],
  );

  const dojaangs = useMemo(
    () => (includeDojaangs ? dojaangsResult.data : []),
    [includeDojaangs, dojaangsResult.data],
  );

  const ranks = useMemo(
    () => (includeRanks ? ranksResult.data : []),
    [includeRanks, ranksResult.data],
  );

  return useMemo(
    () => ({
      students,
      coaches,
      dojaangs,
      ranks,
      loading,
      error,
    }),
    [students, coaches, dojaangs, ranks, loading, error],
  );
}
