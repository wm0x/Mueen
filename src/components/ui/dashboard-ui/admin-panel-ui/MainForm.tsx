import React from "react";
import { AdminOrderActionCardDemo } from "./smoth-hover"; 
import { auth } from "@/auth"; 
import ThemeInitializer from "./ThemeInitializer";


async function MainForm() {

    const session = await auth(); 

    const adminId = session?.user?.id || 'UNAUTHED_USER';
    const adminRole = session?.user?.role || 'user'; 

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
