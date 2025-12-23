// SSE Client management untuk aerator status broadcast

interface SSEClient {
  write: (data: string) => void;
  close: () => void;
}

let clients: SSEClient[] = [];

export function addClient(client: SSEClient) {
  clients.push(client);
}

export function removeClient(client: SSEClient) {
  clients = clients.filter((c) => c !== client);
}

export function broadcast(data: any) {
  for (const client of clients) {
    try {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      // Client mungkin sudah disconnect
    }
  }
}

export function getClientsCount() {
  return clients.length;
}
