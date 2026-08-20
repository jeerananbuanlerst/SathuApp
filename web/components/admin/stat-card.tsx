import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "./ui"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  accent = "primary",
}: {
  label: string
  value: string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  accent?: "primary" | "accent" | "chart-3" | "chart-4"
}) {
  const accentBg: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    "chart-3": "bg-chart-3/15 text-chart-3",
    "chart-4": "bg-chart-4/15 text-chart-4",
  }
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={cn("flex size-11 items-center justify-center rounded-xl", accentBg[accent])}>
          <Icon className="size-5" />
        </div>
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              trendUp ? "bg-chart-4/15 text-chart-4" : "bg-destructive/10 text-destructive",
            )}
          >
            {trendUp ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            {trend}
          </span>
        ) : null}
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  )
}
