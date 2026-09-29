import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — TMC-MarcosCunha",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {children}
    </div>
  );
}
