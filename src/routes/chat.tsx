import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SendHorizontal, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, Card, ErrorNote, Textarea } from "@/components/ai-ui";
import { chatReply } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Ask an AI assistant about workplace communication, prioritisation, meeting prep and follow-ups.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "A conversational AI assistant for everyday work questions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me say no to a meeting request politely",
  "How do I prepare for a performance review in 30 minutes?",
  "Give me a structure for weekly project updates",
  "How should I prioritise when everything is urgent?",
];

function ChatPage() {
  const run = useServerFn(chatReply);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [busy]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const reply = await run({ data: { messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The assistant could not reply.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="AI Workplace Chatbot"
      subtitle="Ask about work — nothing in this conversation is saved."
    >
      <Card className="flex h-[calc(100vh-19rem)] min-h-[26rem] flex-col gap-4">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Start with one of these, or type your own question.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed",
                  m.role === "user"
                    ? "rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}

          {busy ? (
            <p className="animate-pulse text-sm text-muted-foreground">Thinking…</p>
          ) : null}
          {error ? <ErrorNote message={error} /> : null}
          <div ref={endRef} />
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <Textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask about an email, a deadline, a difficult conversation…"
            className="min-h-0"
          />
          <div className="flex justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
              disabled={messages.length === 0}
            >
              <Trash2 className="size-4" />
              Clear chat
            </Button>
            <Button onClick={() => send(input)} disabled={busy || !input.trim()}>
              <SendHorizontal className="size-4" />
              Send
            </Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
