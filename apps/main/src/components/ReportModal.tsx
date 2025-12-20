// components/ReportModal.tsx
// Universal report modal for any content type

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShieldAlert } from "lucide-react";

type TargetType = "beacon" | "ticket_listing" | "connect_thread" | "ticket_thread" | "message";

const REASON_OPTIONS = [
  { value: "harassment", label: "Harassment" },
  { value: "spam_scams", label: "Spam / scams" },
  { value: "impersonation", label: "Impersonation" },
  { value: "unsafe", label: "Unsafe behaviour" },
  { value: "other", label: "Other" },
];

type Props = {
  trigger: React.ReactNode;
  targetType: TargetType;
  targetId: string;
};

export function ReportModal({ trigger, targetType, targetId }: Props) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("harassment");
  const [details, setDetails] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset state when opening
  React.useEffect(() => {
    if (open) {
      setReason("harassment");
      setDetails("");
      setDone(false);
      setError(null);
    }
  }, [open]);

  async function submit() {
    setSubmitting(true);
    setError(null);

    try {
      const r = await fetch("/api/trust/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          reasonCode: reason,
          details: details.trim() || null,
        }),
      });

      const j = await r.json();
      
      if (!j.ok) {
        throw new Error(String(j.error || "Report failed"));
      }

      setDone(true);

      // Auto-close after success
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (e: any) {
      setError(e?.message ?? "Report failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Report
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-2">
            <div className="text-lg font-semibold">Got it.</div>
            <div className="opacity-80">We're on it.</div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm opacity-80">
              Tell us what's wrong. We'll review it.
            </p>

            <div className="space-y-3">
              <Label>Reason</Label>
              <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
                {REASON_OPTIONS.map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`reason-${value}`} />
                    <Label htmlFor={`reason-${value}`} className="cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Additional details (optional)</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Keep it short and clear."
                className="rounded-2xl"
                maxLength={500}
              />
              <p className="text-xs opacity-70 text-right">{details.length}/500</p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 rounded-2xl"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send report"}
              </Button>
              <Button
                variant="secondary"
                className="flex-1 rounded-2xl"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
