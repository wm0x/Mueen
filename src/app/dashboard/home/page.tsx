import { auth } from "@/auth";
import HomePage from "@/components/ui/dashboard-ui/home-ui/HomePage";

export default async function DashboardPage() {
  const session = await auth(); 

  return (
    <div className='h-screen'>
      <HomePage session={session} />
    </div>
  );
}