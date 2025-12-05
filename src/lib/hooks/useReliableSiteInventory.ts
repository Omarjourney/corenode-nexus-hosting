"use client";

import { useEffect, useState } from "react";
import { ServerDetails, getServersList } from "@/lib/reliablesiteInventory";

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
        const mapped = await getServersList();
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
