import { createClient } from "@/lib/supabase/server";
import { getConfiguredAdminEmail, isUserAdmin } from "@/lib/auth/admin";

export type AdminSessionError = "UNAUTHORIZED" | "ADMIN_NOT_CONFIGURED" | "FORBIDDEN";

export type AssertAdminSessionResult =
  | { ok: true }
  | { ok: false; error: AdminSessionError };

export async function assertAdminSession(): Promise<AssertAdminSessionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  if (!getConfiguredAdminEmail()) {
    return { ok: false, error: "ADMIN_NOT_CONFIGURED" };
  }

  if (!isUserAdmin(user.email)) {
    return { ok: false, error: "FORBIDDEN" };
  }

  return { ok: true };
}
