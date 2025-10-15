import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: ambil semua data sensor
export async function GET() {
  const data = await prisma.sensorData.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(data);
}

// POST: tambah data baru
export async function POST(req: Request) {
  const body = await req.json();
  const { suhu, ph, kekeruhan } = body;

  const newData = await prisma.sensorData.create({
    data: { suhu, ph, kekeruhan },
  });

  return NextResponse.json(newData, { status: 201 });
}
