"use client";

import Sidebar from "@/components/Sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col h-screen overflow-hidden">
      <Sidebar />
      {children}
    </main>
  );
}
