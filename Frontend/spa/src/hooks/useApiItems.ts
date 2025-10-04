import { useEffect, useState, useRef } from "react";
import { fetchJson, ApiError } from "../lib/api";
import { useRole } from "../context/RoleContext";

export function useApiItems<T = any>(apiPath: string) {
  const { token, roleLoading } = useRole();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Wait for role loading to complete before making API calls
    if (roleLoading) {
      setLoading(true);
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      setItems([]);
      try {
        const res = await fetchJson<any>(apiPath);

        // support several envelope shapes: array, { data: [...] }, { data: { data: [...] } }, { data: { items: [...] } }, { items: [...] }
        let data: any[] = [];
        if (Array.isArray(res)) {
          data = res;
        } else if (Array.isArray(res?.data)) {
          data = res.data;
        } else if (Array.isArray(res?.data?.data)) {
          data = res.data.data;
        } else if (Array.isArray(res?.data?.items)) {
          data = res.data.items;
        } else if (Array.isArray(res?.items)) {
          data = res.items;
        } else {
          data = [];
        }

        if (!mounted) return;
        setItems(data as T[]);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof ApiError ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [apiPath, roleLoading, reloadKey]);

  return { items, loading, error, reload: () => setReloadKey((k) => k + 1) };
}
