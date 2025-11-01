import MainForm from "@/components/ui/dashboard-ui/admin-panel-ui/orders/MainForm";
import React from "react";

function AdminOrdersPage() {
  return (
    <div>
      <div
        className=" flex justify-between text-center items-center  p-4 mb-10 border-b"
        dir="rtl"
      >
        <div className="flex text-center items-center ">
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
      </div>
      <MainForm />
    </div>
  );
}

export default AdminOrdersPage;
