// วางไฟล์นี้ที่: components/admin/register/Stepper.tsx  (ไฟล์ใหม่)
"use client";

const steps = [
  { label: "ข้อมูลวัด" },
  { label: "เอกสารยืนยัน" },
  { label: "ตรวจสอบ" },
];

export default function Stepper({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center justify-center">
      {steps.map((step, i) => {
        const index = i + 1;
        const done = index < current;
        const active = index === current;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                  done
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : active
                    ? "border-emerald-600 bg-white text-emerald-600"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {index}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  active || done ? "text-emerald-700" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index !== steps.length && (
              <div
                className={`mx-3 h-0.5 w-16 md:w-24 ${
                  done ? "bg-emerald-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}