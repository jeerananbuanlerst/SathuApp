import Link from "next/link"
import Image from "next/image"
import { Plus, Users, CalendarClock } from "lucide-react"
import { Card, SectionHeading, Progress, StatusBadge, Chip } from "@/components/admin/ui"
import { projects, formatBaht } from "@/lib/mock-data"

export default function ProjectsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <SectionHeading
        title="โครงการบริจาคทั้งหมด"
        description={`มีทั้งหมด ${projects.length} โครงการ`}
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" /> สร้างโครงการใหม่
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => {
          const pct = Math.round((p.raised / p.goal) * 100)
          return (
            <Card key={p.id} className="flex flex-col gap-4 p-0 overflow-hidden">
              <div className="relative">
                <Image
                  src={p.image || "/placeholder.svg"}
                  alt={p.title}
                  width={480}
                  height={240}
                  className="h-40 w-full object-cover"
                />
                <div className="absolute left-3 top-3">
                  <StatusBadge status={p.status} />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
                <Chip>{p.category}</Chip>
                <h3 className="font-display font-semibold text-foreground text-balance leading-snug">{p.title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>

                <div className="mt-auto">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-primary">{formatBaht(p.raised)}</span>
                    <span className="text-xs text-muted-foreground">{pct}% ของ {formatBaht(p.goal)}</span>
                  </div>
                  <Progress value={pct} className="mt-1.5" />
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5" /> {p.donors} คน
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="size-3.5" />
                      {p.daysLeft > 0 ? `เหลือ ${p.daysLeft} วัน` : "สิ้นสุดแล้ว"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
