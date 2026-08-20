import Image from "next/image"
import { ShieldCheck, FileText, Plus, Download, CheckCircle2, TrendingUp } from "lucide-react"
import { Card, SectionHeading, Progress } from "@/components/admin/ui"
import { expenses, progressUpdates, projects, formatBaht } from "@/lib/mock-data"

export default function TransparencyPage() {
  const totalRaised = projects.reduce((s, p) => s + p.raised, 0)
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)
  const remaining = totalRaised - totalSpent
  const spentPct = Math.round((totalSpent / totalRaised) * 100)

  // group expenses by category
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount
    return acc
  }, {})
  const catColors: Record<string, string> = {
    ไถ่ชีวิตสัตว์: "bg-primary",
    บูรณะศาสนสถาน: "bg-accent",
    สาธารณสงเคราะห์: "bg-chart-3",
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Card className="flex flex-col gap-4 bg-primary/5">
        <div className="flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">รายงานความโปร่งใส</h2>
            <p className="text-sm text-muted-foreground">
              สรุปการรับและใช้จ่ายเงินบริจาคทั้งหมด เปิดเผยต่อสาธารณะเพื่อความไว้วางใจของญาติโยม
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-card p-4">
            <p className="text-sm text-muted-foreground">รับบริจาคทั้งหมด</p>
            <p className="mt-1 font-display text-xl font-bold text-foreground">{formatBaht(totalRaised)}</p>
          </div>
          <div className="rounded-xl bg-card p-4">
            <p className="text-sm text-muted-foreground">ใช้จ่ายแล้ว</p>
            <p className="mt-1 font-display text-xl font-bold text-accent">{formatBaht(totalSpent)}</p>
          </div>
          <div className="rounded-xl bg-card p-4">
            <p className="text-sm text-muted-foreground">คงเหลือ</p>
            <p className="mt-1 font-display text-xl font-bold text-chart-4">{formatBaht(remaining)}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>ใช้จ่ายไปแล้ว {spentPct}%</span>
            <span>คงเหลือ {100 - spentPct}%</span>
          </div>
          <Progress value={spentPct} className="mt-1.5 h-3" />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Expense breakdown */}
        <Card className="lg:col-span-2">
          <SectionHeading
            title="บัญชีรายจ่าย"
            description="รายการใช้จ่ายพร้อมเลขที่ใบเสร็จ"
            action={
              <button className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                <Download className="size-4" /> ดาวน์โหลด
              </button>
            }
          />
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3">รายการ</th>
                  <th className="hidden px-4 py-3 sm:table-cell">ใบเสร็จ</th>
                  <th className="px-4 py-3">วันที่</th>
                  <th className="px-4 py-3 text-right">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{e.item}</p>
                      <p className="text-xs text-muted-foreground">{e.category}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs text-primary">
                        <FileText className="size-3.5" /> {e.receipt}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">{formatBaht(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Category summary */}
        <Card>
          <SectionHeading title="สัดส่วนการใช้จ่าย" />
          <div className="mt-4 flex flex-col gap-4">
            {Object.entries(byCategory).map(([cat, amount]) => {
              const pct = Math.round((amount / totalSpent) * 100)
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span className={`size-2.5 rounded-full ${catColors[cat] ?? "bg-muted-foreground"}`} />
                      {cat}
                    </span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <p className="mt-0.5 pl-4.5 text-xs text-muted-foreground">{formatBaht(amount)}</p>
                  <Progress value={pct} className="mt-1.5" />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Progress updates */}
      <Card>
        <SectionHeading
          title="อัปเดตความคืบหน้า"
          description="รายงานความคืบหน้าและการใช้เงินของแต่ละโครงการ"
          action={
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              <Plus className="size-4" /> เพิ่มอัปเดต
            </button>
          }
        />
        <ol className="mt-5 flex flex-col gap-6">
          {progressUpdates.map((u, i) => (
            <li key={u.id} className="relative flex gap-4 pl-2">
              <div className="flex flex-col items-center">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="size-5" />
                </span>
                {i < progressUpdates.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {u.project}
                  </span>
                  <span className="text-xs text-muted-foreground">{u.date}</span>
                </div>
                <h4 className="mt-2 font-display font-semibold text-foreground">{u.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{u.detail}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                    <TrendingUp className="size-3.5" /> ใช้เงิน {formatBaht(u.amountUsed)}
                  </span>
                </div>
                {u.image && (
                  <Image
                    src={u.image || "/placeholder.svg"}
                    alt={u.title}
                    width={480}
                    height={200}
                    className="mt-3 h-40 w-full max-w-md rounded-xl object-cover"
                  />
                )}
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
