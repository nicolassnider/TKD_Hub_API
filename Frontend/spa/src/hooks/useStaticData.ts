import { useState, useEffect } from "react";
import { UserDto, DojaangDto, Rank } from "../types/api";

// Type aliases for this hook
type Student = UserDto;
type Coach = UserDto;
type Dojaang = DojaangDto;

// Hook for static data that rarely changes (Ranks, Tuls)
export function useStaticData() {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [tuls, setTuls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        setLoading(true);
        const [ranksRes, tulsRes] = await Promise.all([
          fetch("/api/Ranks"),
          fetch("/api/Tuls"),
        ]);

        if (ranksRes.ok) {
          const ranksData = await ranksRes.json();
          setRanks(ranksData);
        }

        if (tulsRes.ok) {
          const tulsData = await tulsRes.json();
          setTuls(tulsData);
        }
      } catch (err) {
        setError(`Failed to load static data: ${err}`);
        console.error("Error loading static data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaticData();
  }, []);

  return { ranks, tuls, loading, error };
}

// Enhanced hook that combines original useFormData with static data
export function useAllFormData(
  options: {
    includeStudents?: boolean;
    includeCoaches?: boolean;
    includeDojaangs?: boolean;
    includeEvents?: boolean;
    trigger?: any[];
  } = {},
) {
  const {
    includeStudents = false,
    includeCoaches = false,
    includeDojaangs = false,
    includeEvents = false,
    trigger = [],
  } = options;

  // Get static data (cached after first load)
  const {
    ranks,
    tuls,
    loading: staticLoading,
    error: staticError,
  } = useStaticData();

  // Dynamic data states
  const [students, setStudents] = useState<Student[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [dynamicLoading, setDynamicLoading] = useState(false);
  const [dynamicError, setDynamicError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDynamicData = async () => {
      const requests: Promise<Response>[] = [];
      const endpoints: string[] = [];

      if (includeStudents) {
        requests.push(fetch("/api/Students"));
        endpoints.push("students");
      }
      if (includeCoaches) {
        requests.push(fetch("/api/Coaches"));
        endpoints.push("coaches");
      }
      if (includeDojaangs) {
        requests.push(fetch("/api/Dojaangs"));
        endpoints.push("dojaangs");
      }
      if (includeEvents) {
        requests.push(fetch("/api/Events"));
        endpoints.push("events");
      }

      if (requests.length === 0) return;

      try {
        setDynamicLoading(true);
        setDynamicError(null);

        const responses = await Promise.all(requests);

        for (let i = 0; i < responses.length; i++) {
          const response = responses[i];
          const endpoint = endpoints[i];

          if (response.ok) {
            const data = await response.json();
            switch (endpoint) {
              case "students":
                setStudents(data);
                break;
              case "coaches":
                setCoaches(data);
                break;
              case "dojaangs":
                setDojaangs(data);
                break;
              case "events":
                setEvents(data);
                break;
            }
          }
        }
      } catch (err) {
        setDynamicError(`Failed to load data: ${err}`);
        console.error("Error loading dynamic data:", err);
      } finally {
        setDynamicLoading(false);
      }
    };

    fetchDynamicData();
  }, trigger);

  return {
    // Static data
    ranks,
    tuls,
    // Dynamic data
    students: includeStudents ? students : [],
    coaches: includeCoaches ? coaches : [],
    dojaangs: includeDojaangs ? dojaangs : [],
    events: includeEvents ? events : [],
    // Loading states
    loading: staticLoading || dynamicLoading,
    staticLoading,
    dynamicLoading,
    // Error states
    error: staticError || dynamicError,
    staticError,
    dynamicError,
  };
}
