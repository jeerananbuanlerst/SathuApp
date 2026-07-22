"use client";

import Image from "next/image";
import { Check, MapPin, X, Calendar, Building2 } from "lucide-react";

interface Activity {
  id: string;
  temple_name: string;
  activity_name: string;
  province: string;
  district: string;
  subdistrict: string;
  village: string;
  description: string;
  image_url: string | null;
  status: string;
  created_at: string;
}

interface Props {
  activity: Activity | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function ActivityDetailModal({
  activity,
  open,
  onClose,
  onApprove,
  onReject,
}: Props) {
  if (!open || !activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h2 className="text-2xl font-bold">รายละเอียดกิจกรรม</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-8 p-8 md:grid-cols-[320px_1fr]">
          <div>
            <Image
              src={activity.image_url || "https://placehold.co/600x400"}
              alt={activity.activity_name}
              width={400}
              height={300}
              className="h-64 w-full rounded-2xl object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {activity.activity_name}
            </h1>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Building2 size={18} />
                <span>{activity.temple_name}</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1" />

                <div>
                  <p>หมู่บ้าน {activity.village}</p>
                  <p>ตำบล {activity.subdistrict}</p>
                  <p>อำเภอ {activity.district}</p>
                  <p>จังหวัด {activity.province}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} />
                <span>
                  {new Date(activity.created_at).toLocaleDateString("th-TH")}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-2 font-semibold">รายละเอียด</h3>

              <p className="whitespace-pre-line text-gray-600">
                {activity.description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 border-t px-8 py-6">
          <button
            onClick={() => {
              onReject(activity.id);
              onClose();
            }}
            className="rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-100"
          >
            ปฏิเสธ
          </button>

          <button
            onClick={() => {
              onApprove(activity.id);
              onClose();
            }}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            <Check size={18} />
            อนุมัติ
          </button>
        </div>
      </div>
    </div>
  );
}