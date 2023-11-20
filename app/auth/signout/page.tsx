import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default function SignoutScreen({}: {}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  supabase.auth.signOut();

  redirect("/");

  return <></>;
}
