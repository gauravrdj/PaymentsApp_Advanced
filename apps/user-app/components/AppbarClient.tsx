"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { redirect } from "next/navigation";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  return (
   <div>
      <Appbar onSignin={signIn} onSignout={async () => {
        await signOut({ callbackUrl: "https://payments-app-new.onrender.com/" });
        toast.success('See you soon😊')
      }} user={session.data?.user} />
   </div>
  );
}