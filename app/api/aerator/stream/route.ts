import { NextRequest } from "next/server";

let clients: Response[] = [];

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      clients.push({
        write: (data: string) => controller.enqueue(encoder.encode(data)),
        close: () => controller.close(),
      });
    },
  });

  req.signal.addEventListener("abort", () => {
    clients = clients.filter((client) => client.close !== req);
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Fungsi ini nanti dipanggil dari /api/aerator/status POST
export function broadcast(data: any) {
  for (const client of clients) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}
