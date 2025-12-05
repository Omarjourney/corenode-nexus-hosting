import axios from "axios";
import { parseStringPromise } from "xml2js";

export type ServerDetails = {
  dataCenter: string | null;
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

function stringOrNull(x: any): string | null {
  if (x == null) return null;
  if (Array.isArray(x)) return x[0] ?? null;
  return String(x);
}

function numberOrNull(x: any): number | null {
  const s = stringOrNull(x);
  if (s == null || s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function getApiKeyHeader() {
  const apiKey = process.env.RELIABLESITE_INVENTORY_API_KEY;
  if (!apiKey) return {};
  return { ApiKey: apiKey };
}

type SoapEnvelope = Record<string, any>;

function extractBody(parsed: SoapEnvelope): any {
  const envelope =
    parsed["s:Envelope"] ??
    parsed["soap:Envelope"] ??
    parsed["Envelope"] ??
    parsed;

  const body =
    envelope?.["s:Body"] ??
    envelope?.["soap:Body"] ??
    envelope?.["Body"];

  if (Array.isArray(body)) return body[0];
  return body;
}

async function callInventorySoap<T>(operationName: "ServersList"): Promise<T> {
  const INVENTORY_SOAP_URL = "https://api.reliablesite.net/inventory.svc";
  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <${operationName} xmlns="http://tempuri.org/" />
  </soap:Body>
</soap:Envelope>`;

  try {
    const response = await axios.post(INVENTORY_SOAP_URL, soapEnvelope, {
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        SOAPAction: "http://tempuri.org/IInventoryService/ServersList",
        ...getApiKeyHeader(),
      },
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    const parsed = await parseStringPromise(response.data, {
      explicitArray: true,
      ignoreAttrs: false,
    });

    return parsed as T;
  } catch (error: any) {
    const status = error?.response?.status;
    const dataSnippet =
      typeof error?.response?.data === "string"
        ? error.response.data.slice(0, 500)
        : JSON.stringify(error?.response?.data)?.slice(0, 500);
    const message = `ReliableSite SOAP error${
      status ? ` (status ${status})` : ""
    }: ${dataSnippet || error?.message || "Unknown error"}`;
    throw new Error(message);
  }
}

export async function getServersList(): Promise<ServerDetails[]> {
  const raw = await callInventorySoap<any>("ServersList");
  const body = extractBody(raw);

  const responseNode =
    body?.["ServersListResponse"]?.[0] ??
    body?.["ServersListResult"]?.[0] ??
    body?.["ServersListResponse"] ??
    body?.["ServersListResult"];

  const resultNode =
    responseNode?.["ServersListResult"]?.[0] ??
    responseNode?.["ServersListResult"] ??
    responseNode;

  const candidateArrays =
    resultNode?.["Server_Details"] ??
    resultNode?.["ArrayOfServer_Details"]?.[0]?.["Server_Details"] ??
    resultNode?.["ArrayOfInventoryStructServer_Details"]?.[0]?.[
      "InventoryStructServer_Details"
    ] ??
    resultNode;

  const items: any[] = Array.isArray(candidateArrays)
    ? candidateArrays
    : Array.isArray(candidateArrays?.["Server_Details"])
    ? candidateArrays["Server_Details"]
    : [];

  if (!Array.isArray(items) || items.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "ReliableSite ServersList: no items found",
        JSON.stringify(resultNode, null, 2).slice(0, 1000)
      );
    }
    return [];
  }

  const mapped: ServerDetails[] = items.map((item) => {
    const dataCenter = stringOrNull(item.Data_Center);
    const description = stringOrNull(item.Description);
    const detail = stringOrNull(item.Detail);
    const productId = stringOrNull(item.Product_Id);

    const recurring = {
      hourly: numberOrNull(item.Recurring_1_Hour),
      month_1: numberOrNull(item.Recurring_1_Month),
      month_3: numberOrNull(item.Recurring_3_Month),
      month_6: numberOrNull(item.Recurring_6_Month),
      month_12: numberOrNull(item.Recurring_12_Month),
      month_24: numberOrNull(item.Recurring_24_Month),
      month_36: numberOrNull(item.Recurring_36_Month),
    };

    const setup = {
      hourly: numberOrNull(item.Setup_1_Hour),
      month_1: numberOrNull(item.Setup_1_Month),
      month_3: numberOrNull(item.Setup_3_Month),
      month_6: numberOrNull(item.Setup_6_Month),
      month_12: numberOrNull(item.Setup_12_Month),
      month_24: numberOrNull(item.Setup_24_Month),
      month_36: numberOrNull(item.Setup_36_Month),
    };

    const stock = numberOrNull(item.Stock);

    const server: ServerDetails = {
      dataCenter,
      description,
      detail,
      productId,
      recurring,
      setup,
      stock,
    };

    return server;
  });

  return mapped;
}

