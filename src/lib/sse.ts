import type { SSEChannel, SSEMessage } from '@/types';

type SSEClient = {
  id: string;
  controller: ReadableStreamDefaultController;
  channels: Set<SSEChannel>;
};

const clients = new Map<string, SSEClient>();

export function addSSEClient(
  id: string,
  controller: ReadableStreamDefaultController,
  channels: SSEChannel[]
): void {
  clients.set(id, { id, controller, channels: new Set(channels) });
}

export function removeSSEClient(id: string): void {
  clients.delete(id);
}

export function broadcastSSE(channel: SSEChannel, data: unknown): void {
  const message: SSEMessage = {
    channel,
    data,
    timestamp: new Date().toISOString(),
  };
  const payload = `data: ${JSON.stringify(message)}\n\n`;
  const encoder = new TextEncoder();
  const encoded = encoder.encode(payload);

  for (const [id, client] of clients) {
    if (!client.channels.has(channel)) continue;
    try {
      client.controller.enqueue(encoded);
    } catch {
      clients.delete(id);
    }
  }
}

export function getClientCount(): number {
  return clients.size;
}
