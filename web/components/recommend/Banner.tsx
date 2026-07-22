import { Flower2 } from "lucide-react";

export default function Banner() {
  return (
    <div className="card flex gap-4 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light/40 text-primary-dark">
        <Flower2 size={22} />
      </div>
      <div>
        <p className="font-semibold text-text">ร่วมแนะนำกิจกรรมดี ๆ</p>
        <p className="mt-0.5 text-sm text-subtext">
          ช่วยกันบอกต่อกิจกรรมทางศาสนาให้เพื่อน ๆ ได้ร่วมทำบุญและเข้าร่วมกิจกรรม
        </p>
      </div>
    </div>
  );
}