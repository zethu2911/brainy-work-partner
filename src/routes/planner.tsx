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
import { generatePlan } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn your real tasks, deadlines, priorities and available time into a personalised daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "A realistic daily or weekly plan built from your own task list.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const RANGES = ["Daily", "Weekly"] as const;

function PlannerPage() {
  const run = useServerFn(generatePlan);
  const [tasks, setTasks] = useState("");
  const [deadlines, setDeadlines] = useState("");
  const [priorities, setPriorities] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [range, setRange] = useState<(typeof RANGES)[number]>("Daily");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!tasks.trim()) {
      setError("List the tasks you need to plan first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const text = await run({
        data: { tasks, deadlines, priorities, availableTime, range },
      });
      setResult(text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The plan could not be generated.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="AI Task Planner"
      subtitle="Share what's on your plate and get a prioritised schedule you can edit."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <Field label="Your tasks" hint="one per line">
            <Textarea
              rows={6}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Finish client proposal\nReview two design files\nPrep Monday standup"}
            />
          </Field>
          <Field label="Deadlines" hint="optional">
            <Textarea
              value={deadlines}
              onChange={(e) => setDeadlines(e.target.value)}
              placeholder="Proposal due Thursday 17:00, design review before Friday"
            />
          </Field>
          <Field label="Priorities" hint="optional">
            <Input
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
              placeholder="Proposal is most important, standup prep is quick"
            />
          </Field>
          <Field label="Available time">
            <Input
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              placeholder="6 focused hours a day, 08:00–16:00, meetings 11:00–12:00"
            />
          </Field>
          <Field label="Plan type">
            <SegmentedControl options={RANGES} value={range} onChange={setRange} />
          </Field>
          <Button onClick={generate} disabled={busy}>
            <Sparkle className="size-4" />
            {busy ? "Planning…" : "Generate plan"}
          </Button>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-display text-base font-semibold text-foreground">Your plan</h2>
          {error ? <ErrorNote message={error} /> : null}
          {busy && !result ? <Pending label="Building your schedule…" /> : null}
          {result ? (
            <ResultEditor
              value={result}
              onChange={setResult}
              onRegenerate={generate}
              onClear={() => setResult("")}
              busy={busy}
              rows={18}
            />
          ) : !busy && !error ? (
            <p className="text-sm text-muted-foreground">
              Add your tasks and available time, then generate your plan.
            </p>
          ) : null}
        </Card>
      </div>
    </AppShell>
  );
}
