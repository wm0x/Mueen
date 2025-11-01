import React from "react";
import { AdminOrderActionCardDemo } from "./smoth-hover";
import { auth } from "@/auth";
import ThemeInitializer from "./ThemeInitializer";
import { redirect } from "next/navigation";

async function MainForm() {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin" && role !== "administrator") {
    redirect("/not-allowed");
  }

  const adminId = session?.user?.id || "UNAUTHED_USER";
  const adminRole = role || "user";

  return (
    <div className="text-neutral-700 dark:text-neutral-300 flex flex-col gap-0.5">
      <ThemeInitializer />
      <AdminOrderActionCardDemo
        initialAdminId={adminId}
        initialRole={adminRole}
      />
    </div>
  );
}

export default MainForm;
