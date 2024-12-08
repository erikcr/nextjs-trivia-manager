import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { type CookieOptions, createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const orgId = searchParams.get("org_id");
  const roleId = searchParams.get("role_id");

  if (code) {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            // @ts-expect-error
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // @ts-expect-error
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            // @ts-expect-error
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (orgId && roleId) {
        return NextResponse.redirect(
          `${origin}/join?org_id=${orgId}&role_id=${roleId}`
        );
      }

      return NextResponse.redirect(`${origin}/org`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth-code-error`);
}
