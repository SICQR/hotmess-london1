// components/ThreadSafetyMenu.tsx
// Thread safety controls: Mute + Block + Report

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ShieldAlert, BellOff, Ban, AlertTriangle, X } from "lucide-react";
import { ReportModal } from "@/components/ReportModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  threadType: "connect" | "tickets";
  threadId: string;
  otherUserId?: string; // Required for blocking
};

export function ThreadSafetyMenu({ threadType, threadId, otherUserId }: Props) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showBlockConfirm, setShowBlockConfirm] = React.useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = React.useState(false);
  const [muteSuccess, setMuteSuccess] = React.useState(false);
  const [blockSuccess, setBlockSuccess] = React.useState(false);
  const [closeSuccess, setCloseSuccess] = React.useState(false);

  async function mute(minutes: number) {
    setBusy(true);
    setError(null);

    try {
      const r = await fetch("/api/trust/mute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ threadType, threadId, minutes }),
      });

      const j = await r.json();

      if (!j.ok) {
        throw new Error(String(j.error || "Failed to mute"));
      }

      setMuteSuccess(true);
      setTimeout(() => setMuteSuccess(false), 3000);
    } catch (e: any) {
      setError(e?.message ?? "Failed to mute thread.");
      console.error("Mute error:", e);
    } finally {
      setBusy(false);
    }
  }

  async function block() {
    if (!otherUserId) return;

    setBusy(true);
    setError(null);

    try {
      const r = await fetch("/api/trust/block", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ blockedUserId: otherUserId }),
      });

      const j = await r.json();

      if (!j.ok) {
        throw new Error(String(j.error || "Failed to block"));
      }

      setBlockSuccess(true);
      setShowBlockConfirm(false);

      // Refresh page after block to hide thread
      setTimeout(() => {
        window.location.href = "/map";
      }, 2000);
    } catch (e: any) {
      setError(e?.message ?? "Failed to block user.");
      console.error("Block error:", e);
    } finally {
      setBusy(false);
    }
  }

  async function closeThread() {
    setBusy(true);
    setError(null);

    try {
      const r = await fetch('/api/connect/thread/close', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ threadId, reason: 'user_closed' }),
      });

      const j = await r.json();

      if (!j.ok) {
        throw new Error(String(j.error || 'Failed to close thread'));
      }

      setCloseSuccess(true);
      setShowCloseConfirm(false);

      // Refresh page after close to show updated state
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to close thread.');
      console.error('Close thread error:', e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Report Button */}
        <ReportModal
          targetType={threadType === "connect" ? "connect_thread" : "ticket_thread"}
          targetId={threadId}
          trigger={
            <Button variant="ghost" size="sm" className="rounded-2xl">
              <ShieldAlert className="h-4 w-4" />
            </Button>
          }
        />

        {/* Options Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-2xl" disabled={busy}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl w-48">
            <DropdownMenuItem
              onClick={() => mute(60)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <BellOff className="h-4 w-4" />
              Mute 1 hour
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => mute(720)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <BellOff className="h-4 w-4" />
              Mute 12 hours
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => mute(1440)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <BellOff className="h-4 w-4" />
              Mute 24 hours
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => mute(99999)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <BellOff className="h-4 w-4" />
              Mute until expiry
            </DropdownMenuItem>

            {threadType === "connect" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowCloseConfirm(true)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Close thread
                </DropdownMenuItem>
              </>
            )}

            {otherUserId && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowBlockConfirm(true)}
                  className="flex items-center gap-2 cursor-pointer text-red-500"
                >
                  <Ban className="h-4 w-4" />
                  Block user
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Success Messages */}
      {muteSuccess && (
        <div className="fixed top-4 right-4 rounded-2xl border bg-background p-4 shadow-lg z-50 animate-in slide-in-from-top">
          <p className="font-semibold">Muted.</p>
          <p className="text-sm opacity-80">You won't receive notifications.</p>
        </div>
      )}

      {blockSuccess && (
        <div className="fixed top-4 right-4 rounded-2xl border bg-background p-4 shadow-lg z-50 animate-in slide-in-from-top">
          <p className="font-semibold">User blocked.</p>
          <p className="text-sm opacity-80">Redirecting to map...</p>
        </div>
      )}

      {closeSuccess && (
        <div className="fixed top-4 right-4 rounded-2xl border bg-background p-4 shadow-lg z-50 animate-in slide-in-from-top">
          <p className="font-semibold">Thread closed.</p>
          <p className="text-sm opacity-80">Refreshing...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 rounded-2xl border border-red-500/30 bg-red-500/5 p-4 shadow-lg z-50 animate-in slide-in-from-top">
          <p className="font-semibold text-red-500">Error</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      )}

      {/* Block Confirmation Dialog */}
      <AlertDialog open={showBlockConfirm} onOpenChange={setShowBlockConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Block user
            </AlertDialogTitle>
            <AlertDialogDescription>
              Block and hide future contact with this user. All threads will be closed.
              This action can be undone from settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl" disabled={busy}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-2xl bg-red-500 hover:bg-red-600"
              onClick={block}
              disabled={busy}
            >
              {busy ? "Blocking..." : "Block user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Close Thread Confirmation Dialog */}
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <X className="h-5 w-5" />
              Close thread
            </AlertDialogTitle>
            <AlertDialogDescription>
              Close this connection? The thread will be locked and no new messages can be sent.
              You can still read the conversation history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl" disabled={busy}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-2xl"
              onClick={closeThread}
              disabled={busy}
            >
              {busy ? "Closing..." : "Close thread"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
