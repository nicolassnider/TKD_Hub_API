import { useState, useEffect } from "react";

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
function useApiData<T>(endpoint: string, dependencies: any[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const fetchedData = await response.json();
          setData(fetchedData);
        } else {
          setError(`Failed to fetch data from ${endpoint}`);
        }
      } catch (err) {
        setError(`Error fetching ${endpoint}: ${err}`);
        console.error(`Error fetching ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, setData };
}

// Specific hooks for each resource type
export function useStudents(trigger: any[] = []) {
  return useApiData<Student>("/api/Students", trigger);
}

export function useCoaches(trigger: any[] = []) {
  return useApiData<Coach>("/api/Coaches", trigger);
}

export function useDojaangs(trigger: any[] = []) {
  return useApiData<Dojaang>("/api/Dojaangs", trigger);
}

export function useRanks(trigger: any[] = []) {
  return useApiData<Rank>("/api/Ranks", trigger);
}

// Combined hook for forms that need multiple resources
export function useFormData(
  options: {
    includeStudents?: boolean;
    includeCoaches?: boolean;
    includeDojaangs?: boolean;
    includeRanks?: boolean;
    trigger?: any[];
  } = {},
) {
  const {
    includeStudents = false,
    includeCoaches = false,
    includeDojaangs = false,
    includeRanks = false,
    trigger = [],
  } = options;

  const studentsResult = useStudents(includeStudents ? trigger : []);
  const coachesResult = useCoaches(includeCoaches ? trigger : []);
  const dojaangsResult = useDojaangs(includeDojaangs ? trigger : []);
  const ranksResult = useRanks(includeRanks ? trigger : []);

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
