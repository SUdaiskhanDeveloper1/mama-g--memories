import type { Metadata } from "next";
import { AdminApp } from "@/components/AdminApp";

export const metadata: Metadata = {
  title: "Family Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default function Admin() {
  return (
    <div className="page">
      <div className="wrap">
        <h1 className="h2">Family dashboard</h1>
        <p className="lede">Review what visitors send before anything becomes public.</p>
        <AdminApp />
      </div>
    </div>
  );
}
