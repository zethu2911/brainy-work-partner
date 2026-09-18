import { Copy, RefreshCw, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,32,64,0.04)] md:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {hint ? <span className="ml-1 text-xs text-muted-foreground">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const control =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, "min-h-24 resize-y", props.className)} />;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        className,
      )}
    />
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            option === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export function Pending({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-3 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function ResultEditor({
  value,
  onChange,
  onRegenerate,
  onClear,
  busy,
  rows = 16,
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  onClear: () => void;
  busy?: boolean;
  rows?: number;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-3">
      <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
        >
          <Copy className="size-4" />
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button variant="ghost" onClick={onRegenerate} disabled={busy}>
          <RefreshCw className={cn("size-4", busy && "animate-spin")} />
          Regenerate
        </Button>
        <Button variant="ghost" onClick={onClear}>
          <Trash2 className="size-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
