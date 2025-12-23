import { NextRequest } from "next/server";
import { addClient, removeClient } from "@/lib/aeratorBroadcast";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  
  let clientRef: { write: (data: string) => void; close: () => void } | null = null;

  const stream = new ReadableStream({
    start(controller) {
      clientRef = {
        write: (data: string) => {
          try {
            controller.enqueue(encoder.encode(data));
          } catch (e) {
            // Stream mungkin sudah closed
          }
        },
        close: () => {
          try {
            controller.close();
          } catch (e) {
            // Already closed
          }
        },
      };
      addClient(clientRef);
    },
    cancel() {
      if (clientRef) {
        removeClient(clientRef);
      }
    },
  });

  req.signal.addEventListener("abort", () => {
    if (clientRef) {
      removeClient(clientRef);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
