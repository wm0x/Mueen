'use client';

import { MdOutlineManageAccounts } from "react-icons/md";
import { IconSettings } from "@tabler/icons-react";
import { BiSupport } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { IoNotificationsOutline, IoReorderThree } from "react-icons/io5";
import { TbPlaylistAdd } from "react-icons/tb";
import { FloatingDock } from "@/components/ui/dashboard-ui/floating-dock"; 
import { JSX } from "react";
import { FcEngineering } from "react-icons/fc";
import { LayoutDashboard } from "lucide-react";


interface UserSession {
  user?: {
    role: string;
  };
}

interface NavLink {
  title: string;
  icon: JSX.Element;
  href: string;
}

export function NavDock({ session }: { session: UserSession | null }) {
    
    const userRole = session?.user?.role;
    
    const isAdmin = userRole === "admin";
    const isAdministrator = userRole === "administrator";
    const isAnyAdmin = isAdmin || isAdministrator;

    const links: NavLink[] = [
        ...(isAdministrator
            ? [
                {
                    title: "إدارة",
                    icon: (
                        <FcEngineering className="h-full w-full text-red-500 dark:text-red-300" />
                    ),
                    href: "/dashboard/administrator", 
                },
            ]
            : []),
        ...(isAnyAdmin
            ? [
                {
                    title: "لوحة التحكم",
                    icon: (
                        <LayoutDashboard className="h-full w-full " />
                    ),
                    href: "/dashboard/admin", 
                },
            ]
            : []),
            

        
        {
            title: " الدعم الفني ",
            icon: (<BiSupport className="h-full w-full text-[#FFA726] " />),
            href: "/dashboard/soon",
        },
        {
            title: " الطلبات ",
            icon: (<IoReorderThree className="h-full w-full text-neutral-500 dark:text-neutral-300" />),
            href: "/dashboard/orders",
        },
        {
            title: " طلب جديد ",
            icon: (<TbPlaylistAdd className="h-full w-full text-neutral-500 dark:text-neutral-300" />),
            href: "/dashboard/tasks",
        },
        {
            title: "Mueen",
            icon: (<GoHomeFill className="h-full w-full text-neutral-500 dark:text-neutral-300" />),
            href: "/dashboard/home",
        },
        {
            title: "العروض و الاشعارات",
            icon: (<IoNotificationsOutline className="h-full w-full text-neutral-500 dark:text-neutral-300" />),
            href: "/dashboard/notifications",
        },
        {
            title: "الاعدادات",
            icon: (<IconSettings className="h-full w-full text-[#FFA726]" />),
            href: "/dashboard/soon",
        },
        {
            title: "معلوماتي",
            icon: (<FaRegUserCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />),
            href: "/dashboard/profile",
        },
    ];

    return (
        <div className="fixed bottom-18 md:bottom-0 left-0 w-full z-50 px-4 pb-4 flex items-center justify-center">
            <FloatingDock mobileClassName="translate-y-20" items={links} />
        </div>
    );
}