"use client";

import Sidebar from "@/components/Sidebar";

export default function ChatLayout({
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
