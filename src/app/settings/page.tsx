import { auth } from "@/auth";
import { SignOutButton } from "@/components/ui/SignoutButton";

const SettingPage = async () => {
  const session = await auth();

  return (
    <div className="text-black">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignOutButton />
    </div>
  );
};

export default SettingPage;
