/**
 * MESS CONCIERGE WIDGET
 * AI chatbot that knows what's hot, what's safe, and what to do next
 * Context-aware: RIGHT NOW posts, heat, city, XP tier, membership
 */

import { useState } from "react";
import { MessageCircle, X, AlertTriangle } from "lucide-react";

type MessageRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

interface MessConciergeWidgetProps {
  apiBase: string;
  city?: string;
  xpTier?: "fresh" | "regular" | "sinner" | "icon";
  membership?: "free" | "hnh" | "vendor" | "sponsor" | "icon";
}

export function MessConciergeWidget({
  apiBase,
  city,
  xpTier,
  membership,
}: MessConciergeWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "I'm your MESS CONCIERGE. Ask what's hot near you, how to play it safer, or how to squeeze more out of RIGHT NOW, the globe, and the XP grind.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = `${apiBase}/hotmess-concierge`;

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          city,
          xpTier,
          membership,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const json = await res.json();
      const reply = String(json.reply || "").trim();

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          reply ||
          "I glitched mid-gossip. Try asking that again in a second.",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Concierge error", err);
      const failMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content:
          "I lost the signal. Check your connection then hit me again.",
      };
      setMessages((prev) => [...prev, failMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function triggerCare() {
    const text =
      "I need support, not sex. I'm not in a good place and I want help staying safe.";
    void sendMessage(text);
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-hotmess-pink text-black shadow-xl border border-white/20 w-14 h-14 flex items-center justify-center hover:scale-[1.03] active:scale-[0.97] transition-transform"
        aria-label="Open HOTMESS concierge chat"
        title="Ask me what's hot, what's safe, and what to do next."
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-40 w-[min(360px,calc(100vw-2rem))] hm-panel flex flex-col max-h-[calc(100vh-140px)]">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
            <div>
              <div className="hm-label">MESS CONCIERGE</div>
              <div className="text-sm">
                What do you need tonight?
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="px-4 py-3 space-y-2 flex-1 overflow-y-auto text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-hotmess-pink text-black rounded-br-sm"
                      : "bg-white/8 text-white rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-white/50">Thinking…</div>
            )}
          </div>

          {/* Care Button */}
          <div className="px-4">
            <button
              type="button"
              onClick={triggerCare}
              className="w-full mb-2 text-xs hm-chip hm-chip-off flex items-center justify-center gap-2"
            >
              <AlertTriangle size={12} />
              I NEED SUPPORT, NOT SEX
            </button>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-white/10">
            <div className="flex items-center gap-2 px-3 py-2">
              <input
                className="flex-1 hm-input text-sm"
                placeholder="Try: &quot;What&apos;s actually happening near me tonight?&quot;"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-3 py-2 rounded-xl bg-white text-black text-xs uppercase disabled:opacity-40"
              >
                SEND
              </button>
            </div>
          </form>

          {/* Care Disclaimer */}
          <div className="px-4 pb-3 pt-1">
            <p className="text-[10px] text-white/45 leading-snug">
              Care, not clinic. We share information and options, not medical or
              emergency advice. If you or someone else is in danger, contact
              local emergency services.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
