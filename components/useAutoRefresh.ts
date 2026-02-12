"use client";

import { useState, useEffect } from "react";

export function useAutoRefresh<T>(url: string, intervalMs: number = 15000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      const fullUrl = `${window.location.origin}${url}`;
      console.log(`[useAutoRefresh] Fetching: ${fullUrl}`);

      try {
        const res = await fetch(url);
        console.log(`[useAutoRefresh] ${url} -> status ${res.status}`);

        if (!res.ok) {
          const text = await res.text();
          console.error(`[useAutoRefresh] Error body:`, text.slice(0, 500));
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        if (active) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        console.error(`[useAutoRefresh] Fetch failed for ${url}:`, message);
        if (active) {
          setError(`${message} (URL: ${url})`);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, intervalMs);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [url, intervalMs]);

  return { data, loading, error };
}
