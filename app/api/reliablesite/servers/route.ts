import { NextResponse } from "next/server";
import { getServersList } from "@/lib/reliablesiteInventory";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const servers = await getServersList({ endpoint: process.env.SERVER_INVENTORY_ENDPOINT });
    return NextResponse.json({ ok: true, servers }, { status: 200 });
  } catch (error) {
    console.error("ReliableSite servers API error", error);
    const message = error instanceof Error ? error.message : "Failed to load dedicated server inventory from ReliableSite.";
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
