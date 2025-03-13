"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X, CreditCard, Settings, LogOut } from "lucide-react";
import ChatList from "./Chatlist";
import { useToastStore } from "@/components/Toast";

export default function Sidebar() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const menuContent = (
    <div className="p-12 flex flex-col space-y-4">
      <button
        onClick={handleManagePayment}
        disabled={isLoading}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary text-primary-content hover:bg-primary/80 transition disabled:opacity-50"
      >
        <CreditCard className="w-5 h-5" />
        {isLoading ? "Loading..." : "Manage Payment"}
      </button>

      <Link
        href="/settings"
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-base-200 hover:bg-base-300 transition"
      >
        <Settings className="w-5 h-5" />
        Settings
      </Link>

      <button
        onClick={() => signOut()}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-error text-error-content hover:bg-error/80 transition"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );

  async function handleManagePayment() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/manage_payment");
      const data = await response.json();

      if (response.ok && data.url) {
        router.push(data.url);
      } else {
        console.error("Failed to get portal URL:", data.error);
      }
    } catch (error) {
      console.error("Error accessing customer portal:", error);
      useToastStore.getState().showToast("Error accessing customer portal", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <aside className="h-screen bg-base-100 text-base-content">
      {/* Hamburger Button */}
      <div className="py-8 px-4">
        <button
          className="bg-base-200 p-2 rounded-lg shadow-lg text-base-content/80 hover:text-base-content"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay + Sidebar Container */}
      {isOpen && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div
            className="absolute top-0 left-0 h-full w-96 bg-base-100 shadow-lg transition-transform"
          >
            {/* Close Button */}
            <button className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6 text-base-content/45 hover:text-base-content/80" />
            </button>

            {/* Sidebar Content */}
            <div className="flex flex-col h-full">
              <ChatList />
              {menuContent}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
