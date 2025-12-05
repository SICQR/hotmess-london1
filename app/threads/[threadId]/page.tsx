// app/threads/[threadId]/page.tsx
// Unified thread page - handles both ticket and connect threads
// Replaces /tickets/thread/:id and /connect/thread/:id

import { Thread } from "@/components/Thread";

export default function ThreadPage({
  params,
  searchParams,
}: {
  params: { threadId: string };
  searchParams: { mode?: string; listingId?: string };
}) {
  const mode = searchParams.mode === "connect" ? "connect" : "tickets";
  const listingId = searchParams.listingId || null;

  return (
    <Thread
      mode={mode}
      threadId={params.threadId}
      listingId={listingId}
      sendEndpoint={
        mode === "connect"
          ? "/api/connect/thread/send"
          : "/api/tickets/thread/send"
      }
    />
  );
}
