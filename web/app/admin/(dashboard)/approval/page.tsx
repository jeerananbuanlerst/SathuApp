"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Check, X, MapPin, Eye } from "lucide-react";
import ActivityDetailModal from "@/components/approval/ActivityDetailModal";

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
  image_paths: string[] | null;
  status: string;
  created_at: string;
}

export default function ApprovalPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
  fetchActivities();

  supabase.auth.getUser().then(({ data }) => {
    console.log("Current User:", data.user);
  });
}, []);

  async function fetchActivities() {
    setLoading(true);

    const { data, error } = await supabase
      .from("temples_activities")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("โหลดข้อมูลไม่สำเร็จ");
    } else {
      setActivities(data || []);
    }

    setLoading(false);
  }

async function approveActivity(id: string) {
  console.log("Approve ID:", id);

  const confirmApprove = confirm("อนุมัติกิจกรรมนี้ใช่หรือไม่?");
  if (!confirmApprove) return;

  const { data, error } = await supabase
    .from("temples_activities")
    .update({
      status: "approved",
    })
    .eq("id", id)
    .select();

  console.log("Update Data:", data);
  console.log("Update Error:", error);

  if (error) {
    alert(error.message);
    return;
  }

  if (!data || data.length === 0) {
    alert("ไม่มีข้อมูลถูกอัปเดต");
    return;
  }

  alert("อนุมัติสำเร็จ");

  setActivities((prev) => prev.filter((item) => item.id !== id));

  setIsDetailModalOpen(false);
  setSelectedActivity(null);
}
  async function rejectActivity(id: string) {
  const confirmReject = confirm("ปฏิเสธกิจกรรมนี้ใช่หรือไม่?");

  if (!confirmReject) return;

  const { data, error } = await supabase
    .from("temples_activities")
    .update({
      status: "rejected",
    })
    .eq("id", id)
    .select();

  console.log("Data:", data);
  console.log("Error:", error);

  if (error) {
    console.error(error);
    alert("ปฏิเสธไม่สำเร็จ");
    return;
  }

  alert("ปฏิเสธเรียบร้อย");

  setIsDetailModalOpen(false);
  setSelectedActivity(null);

  fetchActivities();
}


  const openActivityDetail = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

 return (
    <>
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sage-dark">
            อนุมัติกิจกรรม
          </h1>

          <p className="mt-1 text-subtext">
            รายการกิจกรรมที่รอการอนุมัติ
          </p>
        </div>

        <span className="rounded-full bg-coral-light px-4 py-1.5 text-sm font-medium text-coral-dark">
          {activities.length} รายการ
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {loading && (
          <div className="p-10 text-center text-subtext">
            กำลังโหลด...
          </div>
        )}

        {!loading &&
          activities.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-6 ${
                index !== activities.length - 1
                  ? "border-b border-border"
                  : ""
              }`}
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text">
                  {item.activity_name}
                </h3>

                <p className="mt-2 font-medium text-sage-dark">
                  {item.temple_name}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-subtext">
                  <MapPin size={15} />
                  {item.province}
                </p>

                <p className="mt-3 text-sm text-subtext">
                  {item.description}
                </p>
              </div>

             <div className="ml-6 flex gap-3">

  <button
    onClick={() => openActivityDetail(item)}
    className="flex items-center gap-2 rounded-xl border border-sage-light bg-white px-4 py-2 font-medium text-sage-dark transition hover:bg-sage-light"
  >
    <Eye size={18} />
    ดูรายละเอียด
  </button>

  <button
    onClick={() => approveActivity(item.id)}
    className="flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 font-medium text-green-700 transition hover:bg-green-200"
  >
    <Check size={18}/>
    อนุมัติ
  </button>

  <button
    onClick={() => rejectActivity(item.id)}
    className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 font-medium text-red-700 transition hover:bg-red-200"
  >
    <X size={18}/>
    ปฏิเสธ
  </button>

</div>
            </div>
          ))}

        {!loading && activities.length === 0 && (
          <div className="p-12 text-center text-subtext">
            ไม่มีกิจกรรมที่รออนุมัติ
          </div>
        )}
      </div>

      <ActivityDetailModal
        activity={selectedActivity}
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApprove={approveActivity}
        onReject={rejectActivity}
      />
    </div>
  </>
);
}