"use client";

import { useEffect, useState } from "react";
import { ServerDetails } from "@/lib/reliablesiteInventory";

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

    async function fetchData() {
      try {
        const res = await fetch("/api/reliablesite/servers", {
          method: "GET",
          cache: "no-store",
        });
        const json = await res.json();

        if (cancelled) return;

        if (json?.ok) {
          setState({ data: json.servers, loading: false, error: null });
        } else {
          setState({
            data: null,
            loading: false,
            error:
              json?.error ||
              "Unable to load dedicated server inventory. Please try again.",
          });
        }
      } catch (err: any) {
        if (cancelled) return;
        setState({
          data: null,
          loading: false,
          error:
            err?.message ||
            "Unable to load dedicated server inventory. Please try again.",
        });
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
