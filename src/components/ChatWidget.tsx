"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi, I'm the AI receptionist for Quantum AI Business Consultants. Ask me about our services, how pricing works, or the industries we work with — or tell me about your business and I'll pass your details to Mark or Jess.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.reply || "Sorry, something went wrong. Please try again.",
        },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong reaching the receptionist. Please email us directly or try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-4 flex h-[28rem] w-[calc(100vw-2rem)] max-w-[22rem] flex-col overflow-hidden rounded-sm border border-border-strong bg-bg-alt shadow-2xl sm:h-[32rem]">
          <div className="flex items-center justify-between border-b border-border bg-bg px-5 py-4">
            <div>
              <p className="font-display text-sm text-gold">AI Receptionist</p>
              <p className="text-xs text-text-muted">Quantum AI Business Consultants</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-text-muted hover:text-gold"
            >
              &times;
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-sm px-4 py-3 text-sm ${
                  m.role === "assistant"
                    ? "bg-bg text-text"
                    : "ml-auto bg-gold text-bg"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-sm bg-bg px-4 py-3 text-sm text-text-muted">
                Typing&hellip;
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-4">
            <label htmlFor="chat-input" className="sr-only">
              Message the AI receptionist
            </label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text focus:border-gold"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-bg disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-bg shadow-xl transition-transform hover:scale-105 sm:h-14 sm:w-14"
        aria-label={open ? "Close chat" : "Chat with our AI receptionist"}
      >
        {open ? (
          <span className="text-lg sm:text-2xl" aria-hidden>
            &times;
          </span>
        ) : (
          <span className="font-display text-base sm:text-lg" aria-hidden>
            Q
          </span>
        )}
      </button>
    </div>
  );
}
