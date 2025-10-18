import { NextResponse } from "next/server";
import { broadcast } from "../stream/route"; // panggil broadcast

let aeratorStatus = {
  isAutoMode: false,
  activeCount: 0,
};

export async function GET() {
  return NextResponse.json(aeratorStatus);
}

export async function POST(req: Request) {
  const body = await req.json();
  aeratorStatus = {
    isAutoMode: body.isAutoMode ?? aeratorStatus.isAutoMode,
    activeCount: body.activeCount ?? aeratorStatus.activeCount,
  };

  // broadcast ke semua dashboard
  broadcast(aeratorStatus);

  return NextResponse.json({ success: true, data: aeratorStatus });
}
