import React from "react";
import { auth } from "@/auth";
import CardInformation from "@/components/ui/dashboard-ui/profile-ui/cardInformation";
import Banner from "@/components/ui/dashboard-ui/profile-ui/banner";

export default async function Profile() {
  const session = await auth();
  return (
    <>
      <div>
        <Banner />
      </div>
      <div>
        <CardInformation session={session} />
      </div>
    </>
  );
}
