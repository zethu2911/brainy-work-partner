import { Link } from "@tanstack/react-router";
import { Mail, CalendarClock, Link2, MessagesSquare, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/summarizer", label: "URL Summarizer", icon: Link2 },
  { to: "/chat", label: "Workplace Chat", icon: MessagesSquare },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
        <Brand />
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-primary data-[status=active]:text-sidebar-primary-foreground"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto pt-8 text-[11px] leading-relaxed text-sidebar-foreground/55">
          Nothing you type is saved. Everything clears when you leave the page.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-card px-4 py-4 md:px-8">
          <div className="md:hidden">
            <Brand />
          </div>
          <div className="mt-3 md:mt-0">
            <h1 className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <nav className="-mx-1 mt-4 flex gap-1 overflow-x-auto pb-1 md:hidden">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground data-[status=active]:border-primary data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>

        <footer className="border-t border-border bg-card px-4 py-4 md:px-8">
          <p className="text-xs leading-relaxed text-muted-foreground">
            AI-generated content may contain errors. Review and verify important information
            before using it for workplace decisions or communications.
          </p>
        </footer>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
        AW
      </span>
      <span className="font-display text-sm font-semibold leading-tight text-foreground">
        AI Workplace
        <span className="block text-xs font-normal text-muted-foreground">
          Productivity Assistant
        </span>
      </span>
    </Link>
  );
}
