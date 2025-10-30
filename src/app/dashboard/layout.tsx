
import { auth } from '@/auth';
import React from 'react';
import { NavDock } from '../../components/ui/dashboard-ui/nav';


export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const session = await auth(); 

  return (
    <div dir="ltr" className="">
      {children}
      <NavDock session={session} />
    </div>
  );
}