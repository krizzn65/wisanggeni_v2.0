import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // jangan pakai generated/prisma

export async function GET() {
  try {
    const latest = await prisma.sensors.findFirst({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        ph: true,
        suhu: true,
        kekeruhan: true,
        kualitas: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!latest) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" });
    }

    return NextResponse.json({ success: true, data: latest });
  } catch (error) {
    console.error("Error fetching latest sensor data:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
