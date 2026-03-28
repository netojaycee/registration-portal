"use client"
import { Suspense } from "react";
import AdminDashboard from "@/components/local/admin-dashboard";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-zinc-50 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 p-4 md:p-8">
      <Suspense fallback={<div className="text-center mt-16 text-lg">Loading admin dashboard...</div>}>
        <AdminDashboard />
      </Suspense>
    </main>
  );
}
