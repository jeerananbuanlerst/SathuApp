import { donationTrend, formatBaht } from "@/lib/mock-data"

export function TrendChart() {
  const max = Math.max(...donationTrend.map((d) => d.amount))
  const w = 640
  const h = 200
  const pad = 12
  const step = (w - pad * 2) / (donationTrend.length - 1)
  const points = donationTrend.map((d, i) => {
    const x = pad + i * step
    const y = h - pad - (d.amount / max) * (h - pad * 2)
    return { x, y, ...d }
  })
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-52 w-full" preserveAspectRatio="none" role="img" aria-label="กราฟยอดบริจาค 7 วันล่าสุด">
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#fill)" />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p) => (
          <circle key={p.day} cx={p.x} cy={p.y} r="4" fill="var(--card)" stroke="var(--primary)" strokeWidth="2.5" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between px-2 text-[11px] text-muted-foreground">
        {donationTrend.map((d) => (
          <span key={d.day}>{d.day}</span>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        ยอดสูงสุด <span className="font-semibold text-foreground">{formatBaht(max)}</span> ในวันที่ 6 ส.ค.
      </p>
    </div>
  )
}
