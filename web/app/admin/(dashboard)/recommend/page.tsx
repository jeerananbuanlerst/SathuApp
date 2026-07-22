import Header from "@/components/recommend/Header";
import Banner from "@/components/recommend/Banner";
import ActivityForm from "@/components/recommend/ActivityForm";

export default function RecommendPage() {
  return (
    <div className="space-y-8">

      <Header
        title="เพิ่มกิจกรรม"
        subtitle="สร้างกิจกรรมใหม่เพื่อส่งเข้าสู่ขั้นตอนการอนุมัติ"
      />

      <Banner />

      <ActivityForm />

    </div>
  );
}