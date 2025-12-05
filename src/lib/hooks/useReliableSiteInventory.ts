"use client";

import { useEffect, useState } from "react";
import { ServerDetails, mapDbToUi } from "@/lib/reliablesiteInventory";

type HookState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useServersList(): HookState<ServerDetails[]> {
  const [state, setState] = useState<HookState<ServerDetails[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadInventory() {
      setState({ data: null, loading: true, error: null });

      try {
        const res = await fetch("https://panel.corenodex.com/api/servers.php", {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const text = await res.text();
        if (!text) {
          throw new Error("Empty response from servers API");
        }

        let json: any;
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error("Invalid JSON from servers API");
        }

        if (!json.success || !Array.isArray(json.servers)) {
          throw new Error(json.error || "Malformed inventory payload");
        }

        const mapped = json.servers.map(mapDbToUi);
        if (cancelled) return;
        setState({ data: mapped, loading: false, error: null });
      } catch (err: any) {
        if (cancelled) return;
        console.error("Failed to load inventory", err);
        setState({
          data: null,
          loading: false,
          error: err.message || "Failed to load inventory",
        });
      }
    }

    loadInventory();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
