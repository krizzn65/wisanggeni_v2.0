import { NextRequest } from "next/server"
import { initSocket } from "@/lib/socketServer"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function GET(req: NextRequest) {
  if (!(global as any).io) {
    const { Server } = require("socket.io")
    const server = require("http").createServer()
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    })
    ;(global as any).io = io
  }

  return new Response("Socket server aktif", { status: 200 })
}
