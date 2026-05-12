import { PromoBar } from "@/components/site/PromoBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
