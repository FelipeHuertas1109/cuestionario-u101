"use client";

import { useState, useEffect } from "react";

// Carga datos una vez al montar el componente.
// Si en el futuro quieres reactivar polling, pasa intervalMs > 0.
export function useAutoRefresh<T>(url: string, intervalMs: number = 0) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        if (active) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Error desconocido";
        if (active) {
          setError(message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    const interval =
      intervalMs > 0 ? setInterval(fetchData, intervalMs) : null;

    return () => {
      active = false;
      controller.abort();
      if (interval) clearInterval(interval);
    };
  }, [url, intervalMs]);

  return { data, loading, error };
}
