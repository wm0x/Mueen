import { auth } from "@/auth";
import { AdminOrderActionCardDemo } from "@/components/ui/dashboard-ui/admin-panel-ui/accepted-orders/MainForm";
import { redirect } from "next/navigation";
import React from "react";

async function AcceptedOrdersPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin" && role !== "administrator") {
    redirect("/not-allowed");
  }

  const adminId = session?.user?.id || "UNAUTHED_USER";
  const adminRole = role || "user";
  return (
    <div>
      <div className=" flex  text-center items-center p-4 mb-10 border-b" dir="rtl">
        <img
          src={"/mueen.png"}
          alt={"logo"}
          width={95}
          height={95}
          className="dark:invert -mr-10 md:-mr-0"
        />
        <span className="text-5xl font-bold text-black dark:text-white ">
          مُــــــعِــــــيــــــن
        </span>
      </div>
      <AdminOrderActionCardDemo
        initialAdminId={adminId}
        initialRole={adminRole}
      />
    </div>
  );
}

export default AcceptedOrdersPage;
