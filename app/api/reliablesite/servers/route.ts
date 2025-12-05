import { NextResponse } from "next/server";
import { getServersList } from "@/lib/reliablesiteInventory";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const servers = await getServersList();
    return NextResponse.json({ ok: true, servers }, { status: 200 });
  } catch (error) {
    console.error("ReliableSite servers API error", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to load dedicated server inventory from ReliableSite.",
      },
      { status: 500 }
    );
  }
}
