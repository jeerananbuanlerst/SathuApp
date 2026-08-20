import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { ProjectStatus } from "@/lib/mock-data"

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>
      {children}
    </div>
  )
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground text-balance">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function Progress({ value, className }: { value: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

const statusMap: Record<ProjectStatus, { label: string; className: string }> = {
  active: { label: "กำลังระดมทุน", className: "bg-primary/10 text-primary" },
  completed: { label: "สำเร็จแล้ว", className: "bg-chart-4/15 text-chart-4" },
  draft: { label: "ฉบับร่าง", className: "bg-muted text-muted-foreground" },
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const s = statusMap[status]
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", s.className)}>
      {s.label}
    </span>
  )
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground", className)}>
      {children}
    </span>
  )
}
