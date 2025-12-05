// app/tickets/thread/[threadId]/page.tsx
// Tickets thread wrapper using unified Thread component

import Thread from "@/components/Thread";

export default async function Page({ params }: { params: { threadId: string } }) {
  // Note: Add auth check here if you have a requireUser() helper
  // await requireUser();

  return (
    <Thread 
      mode="tickets" 
      threadId={params.threadId} 
      sendEndpoint="/api/tickets/thread/send"
    />
  );
}
