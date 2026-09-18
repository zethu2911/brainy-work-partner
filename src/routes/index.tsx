import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, CalendarClock, Link2, MessagesSquare } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ai-ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Write emails, plan your tasks, summarise links and ask a workplace assistant — all AI-powered, nothing saved.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Four AI tools for professionals: email writing, task planning, URL summaries and workplace chat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a purpose and a few key points into a polished email in your chosen tone.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "AI Task Planner",
    body: "Give your tasks, deadlines and available time — get a realistic daily or weekly plan.",
  },
  {
    to: "/summarizer",
    icon: Link2,
    title: "AI URL Summarizer",
    body: "Paste a link and get a summary, key insights and recommended next steps.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Workplace Chatbot",
    body: "Ask anything about work: difficult messages, meeting prep, prioritising, follow-ups.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Welcome back"
      subtitle="Pick a tool to get started. Your inputs and results stay in this browser session only."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map(({ to, icon: Icon, title, body }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-base font-semibold text-foreground">
                {title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-4">
        <h2 className="font-display text-base font-semibold text-foreground">
          Privacy by design
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          This app has no accounts and no storage. Emails, plans, links and conversations are not
          kept anywhere — refreshing the page clears everything, so there is no activity history
          to show.
        </p>
      </Card>
    </AppShell>
  );
}
