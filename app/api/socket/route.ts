import { NextRequest, NextResponse } from "next/server"

// Route Segment Config untuk Next.js 14 App Router
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  // Socket.IO tidak bisa dijalankan langsung di Next.js App Router
  // Gunakan custom server atau service terpisah untuk WebSocket
  
  return NextResponse.json({ 
    status: "ok",
    message: "Socket endpoint ready. Use separate WebSocket server for real-time connections."
  })
}
