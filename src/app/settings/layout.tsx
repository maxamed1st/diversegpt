"use client";

import Sidebar from "@/components/Sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex gap-4">
      <Sidebar />
      {children}
    </main>
  );
}
