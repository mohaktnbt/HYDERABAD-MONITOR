import { addSSEClient, removeSSEClient } from '@/lib/sse';
import type { SSEChannel } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const channels = (url.searchParams.get('channels') || 'aqi,weather,news')
    .split(',') as SSEChannel[];

  const clientId = `sse_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`)
      );

      addSSEClient(clientId, controller, channels);

      // Keep-alive ping every 30s
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch {
          clearInterval(pingInterval);
        }
      }, 30000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        removeSSEClient(clientId);
        try { controller.close(); } catch { /* already closed */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
