import {
  IconBrandAsana,
  IconDashboard,
  IconSettings,
} from "@tabler/icons-react";
import { HiUserGroup } from "react-icons/hi2";
import { PiCardsThreeThin } from "react-icons/pi";

import { FaRegUserCircle } from "react-icons/fa";
import { IoCreateOutline, IoNotificationsOutline } from "react-icons/io5";
import { BsLightbulb } from "react-icons/bs";
import { IconBulb } from "@tabler/icons-react";
import { FloatingDock } from "@/components/ui/dashboard-ui/floating-dock";
import { GoHomeFill } from "react-icons/go";
import { BiSupport } from "react-icons/bi";
import { TbPlaylistAdd } from "react-icons/tb";
import { IoReorderThree } from "react-icons/io5";



export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {

  const links = [
    // ...(session?.user?.role === "admin"
    // ? [
    //     {
    //       title: "Admin Panel",
    //       icon: <IconDashboard className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    //       href: "/dashboard/profile",
    //     },
    //   ]
    // : []),
    {
      title: " الدعم الفني ",
      icon: (
        <BiSupport className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "",
    },
    {
      title: "المهمات السابقه",
      icon: (
        <IoReorderThree className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: " مهمه جديده ",
      icon: (
        <TbPlaylistAdd className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard/tasks",
    },
    {
      title: "Mueen",
      icon: (
        <GoHomeFill></GoHomeFill>
      ),
      href: "/dashboard/home",
    },
    {
      title: "العروض و الاشعارات",
      icon: (
        <IoNotificationsOutline className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "الاعدادات",
      icon: (
        <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard/setting",
    },
    {
      title: "معلوماتي",
      icon: (
        <FaRegUserCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/dashboard/profile",
    },
  ];

  return (
    <div dir="ltr" className="">
      {children}
      <div className="fixed bottom-18 md:bottom-0 left-0 w-full z-50 px-4 pb-4 flex items-center justify-center">
        <FloatingDock mobileClassName="translate-y-20" items={links} />
      </div>
    </div>
  );
}
