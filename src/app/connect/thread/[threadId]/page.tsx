// app/connect/thread/[threadId]/page.tsx
// Connect thread wrapper using unified Thread component

import Thread from "@/components/Thread";

export default async function Page({ params }: { params: { threadId: string } }) {
  // Note: Add auth check here if you have a requireUser() helper
  // await requireUser();

  return (
    <Thread 
      mode="connect" 
      threadId={params.threadId} 
      sendEndpoint="/api/connect/thread/send"
    />
  );
}
