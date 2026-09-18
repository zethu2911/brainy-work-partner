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
} from "@/components/ai-ui";
import { summarizeUrl } from "@/lib/ai.functions";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "AI URL Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste any article or web page link and get a summary, key insights and actionable recommendations.",
      },
      { property: "og:title", content: "AI URL Summarizer" },
      {
        property: "og:description",
        content: "Summaries, insights and next steps from the real content of any link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const run = useServerFn(summarizeUrl);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    const value = url.trim();
    if (!/^https?:\/\/\S+\.\S+/.test(value)) {
      setError("Paste a full web address starting with http:// or https://");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setResult(await run({ data: { url: value } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "That link could not be summarised.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="AI URL Summarizer"
      subtitle="Paste a link and get a summary, key insights and recommended next steps."
    >
      <div className="space-y-4">
        <Card className="space-y-4">
          <Field label="Article or page link">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") generate();
              }}
              placeholder="https://example.com/article"
              inputMode="url"
            />
          </Field>
          <Button onClick={generate} disabled={busy}>
            <Sparkle className="size-4" />
            {busy ? "Reading the page…" : "Summarise link"}
          </Button>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-display text-base font-semibold text-foreground">Results</h2>
          {error ? <ErrorNote message={error} /> : null}
          {busy && !result ? <Pending label="Reading the page and summarising…" /> : null}
          {result ? (
            <ResultEditor
              value={result}
              onChange={setResult}
              onRegenerate={generate}
              onClear={() => setResult("")}
              busy={busy}
              rows={20}
            />
          ) : !busy && !error ? (
            <p className="text-sm text-muted-foreground">
              Paste a public link above. Pages behind a login or paywall can't be read.
            </p>
          ) : null}
        </Card>
      </div>
    </AppShell>
  );
}
