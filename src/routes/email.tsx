import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkle } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  Button,
  Card,
  ErrorNote,
  Field,
  Input,
  Pending,
  ResultEditor,
  SegmentedControl,
  Textarea,
} from "@/components/ai-ui";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate a professional email from your recipient, purpose, context and key points in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "AI-written workplace emails based on your own details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!recipient.trim() || !purpose.trim()) {
      setError("Add at least the recipient and the purpose of the email.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const text = await run({ data: { recipient, purpose, context, keyPoints, tone } });
      setResult(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The email could not be generated.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="Smart Email Generator"
      subtitle="Describe the email you need and the AI writes it from your details."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <Field label="Recipient">
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Nomsa, Head of Finance"
            />
          </Field>
          <Field label="Purpose">
            <Input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Request approval for the Q4 software budget"
            />
          </Field>
          <Field label="Context" hint="optional">
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Background the reader needs, previous conversations, timelines…"
            />
          </Field>
          <Field label="Key points" hint="optional, one per line">
            <Textarea
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={"Cost is R48 000\nNeeded before 30 November\nSaves 6 hours a week"}
            />
          </Field>
          <Field label="Tone">
            <SegmentedControl options={TONES} value={tone} onChange={setTone} />
          </Field>
          <Button onClick={generate} disabled={busy}>
            <Sparkle className="size-4" />
            {busy ? "Writing…" : "Generate email"}
          </Button>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-display text-base font-semibold text-foreground">Your email</h2>
          {error ? <ErrorNote message={error} /> : null}
          {busy && !result ? <Pending label="Writing your email…" /> : null}
          {result ? (
            <ResultEditor
              value={result}
              onChange={setResult}
              onRegenerate={generate}
              onClear={() => setResult("")}
              busy={busy}
            />
          ) : !busy && !error ? (
            <p className="text-sm text-muted-foreground">
              Fill in the details on the left, then generate. You can edit the result before
              copying it.
            </p>
          ) : null}
        </Card>
      </div>
    </AppShell>
  );
}
