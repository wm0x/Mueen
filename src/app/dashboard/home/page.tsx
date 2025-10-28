// src/app/dashboard/home/page.tsx (This is a Server Component, no 'use client')
import { auth } from "@/auth";
import HomePage from "@/components/ui/dashboard-ui/home-ui/HomePage";

export default async function DashboardPage() {
  // ✅ Fetch session securely on the Server
  const session = await auth(); 

  return (
    <div className='h-screen'>
      {/* Pass the session data as a prop */}
      <HomePage session={session} />
    </div>
  );
}