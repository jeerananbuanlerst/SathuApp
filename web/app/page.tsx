import Header from "@/components/recommend/Header";
import Banner from "@/components/recommend/Banner";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Banner />
      </main>
    </div>
  );
}