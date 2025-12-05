// Type definitions and helpers for ReliableSite inventory API responses

export type ServerRow = {
  rs_id: string;
  family: string;
  location: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  base_price: number | string;
  cnx_price: number | string;
  qty: number;
  raw_json?: string | null;
};

export type ServersApiResponse = {
  success: boolean;
  count?: number;
  servers?: ServerRow[];
  error?: string;
};

export type ServerDetails = {
  dataCenter: string | null;
  family: string | null;
  region: string | null;
  description: string | null;
  detail: string | null;
  productId: string | null;
  recurring: {
    hourly: number | null;
    month_1: number | null;
    month_3: number | null;
    month_6: number | null;
    month_12: number | null;
    month_24: number | null;
    month_36: number | null;
  };
  setup: {
    hourly: number | null;
    month_1: number | null;
    month_3: number | null;
    month_6: number | null;
    month_12: number | null;
    month_24: number | null;
    month_36: number | null;
  };
  stock: number | null;
};

// Maps a DB row from /api/servers.php to the UI-friendly structure
export function mapDbToUi(dbRow: ServerRow): ServerDetails {
  const recurringPrice = dbRow.cnx_price != null ? Number(dbRow.cnx_price) : null;
  const location = dbRow.location || "";

  return {
    dataCenter: location || null,
    family: dbRow.family || null,
    region: location ? location.replace(/\s+/g, "-").toUpperCase() : null,
    description: dbRow.cpu || null,
    detail: [dbRow.ram, dbRow.storage, dbRow.bandwidth].filter(Boolean).join(" | ") || null,
    productId: dbRow.rs_id?.toString() || null,
    recurring: {
      hourly: null,
      month_1: Number.isFinite(recurringPrice) ? (recurringPrice as number) : recurringPrice,
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

type InventoryRequest = {
  family?: string;
  location?: string;
  endpoint?: string;
};

// Fetches inventory from the PHP endpoint and returns mapped results
export async function getServersList(params: InventoryRequest = {}): Promise<ServerDetails[]> {
  const endpoint = params.endpoint || process.env.SERVER_INVENTORY_ENDPOINT || "/api/servers.php";
  const url = new URL(endpoint, typeof window === "undefined" ? "http://localhost" : window.location.origin);

  if (params.family) {
    url.searchParams.set("family", params.family);
  }
  if (params.location) {
    url.searchParams.set("location", params.location);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  const payloadText = await res.text();
  if (!payloadText.trim()) {
    throw new Error("Empty response from servers API");
  }

  let parsed: ServersApiResponse;
  try {
    parsed = JSON.parse(payloadText);
  } catch (error) {
    throw new Error(`Invalid JSON from servers API: ${(error as Error)?.message || "parse error"}`);
  }

  if (!res.ok) {
    const message = parsed?.error || `HTTP ${res.status}`;
    throw new Error(message);
  }

  if (!parsed.success || !Array.isArray(parsed.servers)) {
    throw new Error(parsed?.error || "Malformed inventory payload");
  }

  return parsed.servers.map((row) => mapDbToUi(row));
}
