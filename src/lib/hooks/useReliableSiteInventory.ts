"use client";

import { useEffect, useState } from "react";
import { ServerDetails } from "@/lib/reliablesiteInventory";

type HookState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Maps database row from /api/servers.php to ServerDetails UI type
function mapDbToUi(dbRow: any): ServerDetails {
  return {
    dataCenter: dbRow.location || null,
    description: dbRow.cpu || null,
    detail: [dbRow.ram, dbRow.storage, dbRow.bandwidth].filter(Boolean).join(" | ") || null,
    productId: dbRow.rs_id?.toString() || null,
    recurring: {
      hourly: null,
      month_1: dbRow.cnx_price ? parseFloat(dbRow.cnx_price) : null,
      month_3: null,
      month_6: null,
      month_12: null,
      month_24: null,
      month_36: null,
    },
    setup: {
      hourly: null,
      month_1: null,
      month_3: null,
      month_6: null,
      month_12: null,
      month_24: null,
      month_36: null,
    },
    stock: dbRow.qty ?? 0,
  };
}

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
        const res = await fetch("/api/servers.php", {
          method: "GET",
          cache: "no-store",
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

        if (cancelled) return;

        const mapped = json.servers.map(mapDbToUi);
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
