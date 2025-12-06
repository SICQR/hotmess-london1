// components/trust/TrustActionsSheet.tsx
// Universal Trust Actions: Report, Block, Mute

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldAlert, Ban, BellOff, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ReportTargetType = "beacon" | "ticket_listing" | "connect_thread" | "ticket_thread" | "message";

type Props = {
  targetType: ReportTargetType;
  targetId: string;
  otherUserId?: string; // For blocking
  threadType?: "connect" | "tickets"; // For muting
  children?: React.ReactNode; // Trigger button
};

const REASON_CODES = [
  { value: "spam", label: "Spam or irrelevant content" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "illegal_content", label: "Illegal content" },
  { value: "misinformation", label: "Misinformation" },
  { value: "violence", label: "Threats or violence" },
  { value: "csam", label: "Child safety concern" },
  { value: "other", label: "Other" },
];

const MUTE_DURATIONS = [
  { value: 60, label: "1 hour" },
  { value: 720, label: "12 hours" },
  { value: 1440, label: "24 hours" },
  { value: 4320, label: "3 days" },
  { value: 10080, label: "Until beacon expires" },
];

export default function TrustActionsSheet({
  targetType,
  targetId,
  otherUserId,
  threadType,
  children,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"menu" | "report" | "block" | "mute">("menu");

  // Report state
  const [reasonCode, setReasonCode] = React.useState("spam");
  const [details, setDetails] = React.useState("");
  const [reportSubmitting, setReportSubmitting] = React.useState(false);
  const [reportSuccess, setReportSuccess] = React.useState(false);
  const [reportError, setReportError] = React.useState<string | null>(null);

  // Block state
  const [blockSubmitting, setBlockSubmitting] = React.useState(false);
  const [blockSuccess, setBlockSuccess] = React.useState(false);
  const [blockError, setBlockError] = React.useState<string | null>(null);

  // Mute state
  const [muteDuration, setMuteDuration] = React.useState(60);
  const [muteSubmitting, setMuteSubmitting] = React.useState(false);
  const [muteSuccess, setMuteSuccess] = React.useState(false);
  const [muteError, setMuteError] = React.useState<string | null>(null);

  // Reset state when opening
  React.useEffect(() => {
    if (open) {
      setMode("menu");
      setReportSuccess(false);
      setReportError(null);
      setBlockSuccess(false);
      setBlockError(null);
      setMuteSuccess(false);
      setMuteError(null);
    }
  }, [open]);

  async function submitReport() {
    setReportSubmitting(true);
    setReportError(null);

    try {
      const { data, error } = await supabase.rpc("create_report", {
        p_target_type: targetType,
        p_target_id: targetId,
        p_reason_code: reasonCode,
        p_details: details.trim() || null,
      });

      if (error) throw error;

      setReportSuccess(true);
      setTimeout(() => setOpen(false), 2000);
    } catch (e: any) {
      setReportError(e.message || "Failed to submit report.");
    } finally {
      setReportSubmitting(false);
    }
  }

  async function submitBlock() {
    if (!otherUserId) return;

    setBlockSubmitting(true);
    setBlockError(null);

    try {
      const { error } = await supabase.rpc("block_user", {
        p_blocked_user: otherUserId,
      });

      if (error) throw error;

      setBlockSuccess(true);
      setTimeout(() => setOpen(false), 2000);
    } catch (e: any) {
      setBlockError(e.message || "Failed to block user.");
    } finally {
      setBlockSubmitting(false);
    }
  }

  async function submitMute() {
    if (!threadType) return;

    setMuteSubmitting(true);
    setMuteError(null);

    try {
      const { error } = await supabase.rpc("mute_thread", {
        p_thread_type: threadType,
        p_thread_id: targetId,
        p_minutes: muteDuration,
      });

      if (error) throw error;

      setMuteSuccess(true);
      setTimeout(() => setOpen(false), 2000);
    } catch (e: any) {
      setMuteError(e.message || "Failed to mute thread.");
    } finally {
      setMuteSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="rounded-2xl">
            <ShieldAlert className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        {mode === "menu" && (
          <>
            <SheetHeader>
              <SheetTitle>Trust Actions</SheetTitle>
              <SheetDescription>
                Report, block, or mute to keep your experience safe.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-3 pt-6">
              <Button
                variant="outline"
                className="w-full rounded-2xl justify-start"
                onClick={() => setMode("report")}
              >
                <ShieldAlert className="h-5 w-5 mr-3" />
                Report
              </Button>

              {otherUserId && (
                <Button
                  variant="outline"
                  className="w-full rounded-2xl justify-start"
                  onClick={() => setMode("block")}
                >
                  <Ban className="h-5 w-5 mr-3" />
                  Block User
                </Button>
              )}

              {threadType && (
                <Button
                  variant="outline"
                  className="w-full rounded-2xl justify-start"
                  onClick={() => setMode("mute")}
                >
                  <BellOff className="h-5 w-5 mr-3" />
                  Mute Thread
                </Button>
              )}
            </div>
          </>
        )}

        {mode === "report" && (
          <>
            <SheetHeader>
              <SheetTitle>Report Content</SheetTitle>
              <SheetDescription>
                Help us keep HOTMESS safe. Reports are reviewed by our moderation
                team.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 pt-6">
              {reportSuccess ? (
                <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-4 text-center space-y-2">
                  <p className="font-semibold">Report submitted</p>
                  <p className="text-sm opacity-80">
                    Our moderation team will review it shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Select value={reasonCode} onValueChange={setReasonCode}>
                      <SelectTrigger id="reason" className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REASON_CODES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="details">Additional details (optional)</Label>
                    <Textarea
                      id="details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Provide more context..."
                      className="rounded-2xl"
                      maxLength={1000}
                    />
                    <p className="text-xs opacity-70">{details.length}/1000</p>
                  </div>

                  {reportError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-3 text-sm">
                      {reportError}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl"
                      onClick={() => setMode("menu")}
                      disabled={reportSubmitting}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 rounded-2xl"
                      onClick={submitReport}
                      disabled={reportSubmitting}
                    >
                      {reportSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {mode === "block" && (
          <>
            <SheetHeader>
              <SheetTitle>Block User</SheetTitle>
              <SheetDescription>
                This will close all threads with this user and prevent future
                contact.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 pt-6">
              {blockSuccess ? (
                <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-4 text-center space-y-2">
                  <p className="font-semibold">User blocked</p>
                  <p className="text-sm opacity-80">
                    All threads have been closed.
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <p className="font-semibold">Are you sure?</p>
                    </div>
                    <p className="text-sm opacity-80">
                      You won't see this user's content or receive messages from
                      them. This action can be undone from settings.
                    </p>
                  </div>

                  {blockError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-3 text-sm">
                      {blockError}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl"
                      onClick={() => setMode("menu")}
                      disabled={blockSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 rounded-2xl"
                      onClick={submitBlock}
                      disabled={blockSubmitting}
                    >
                      {blockSubmitting ? "Blocking..." : "Block User"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {mode === "mute" && (
          <>
            <SheetHeader>
              <SheetTitle>Mute Thread</SheetTitle>
              <SheetDescription>
                Temporarily stop notifications from this thread.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 pt-6">
              {muteSuccess ? (
                <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-4 text-center space-y-2">
                  <p className="font-semibold">Thread muted</p>
                  <p className="text-sm opacity-80">
                    You won't receive notifications until it expires.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Mute for</Label>
                    <Select
                      value={String(muteDuration)}
                      onValueChange={(v) => setMuteDuration(Number(v))}
                    >
                      <SelectTrigger id="duration" className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MUTE_DURATIONS.map((d) => (
                          <SelectItem key={d.value} value={String(d.value)}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {muteError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-3 text-sm">
                      {muteError}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl"
                      onClick={() => setMode("menu")}
                      disabled={muteSubmitting}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 rounded-2xl"
                      onClick={submitMute}
                      disabled={muteSubmitting}
                    >
                      {muteSubmitting ? "Muting..." : "Mute Thread"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}