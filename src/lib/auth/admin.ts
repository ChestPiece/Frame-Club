/**
 * Single source for "is admin email configured and does this user match".
 * ADMIN_EMAIL must be set for any admin operation (fail closed).
 */
export function getConfiguredAdminEmail(): string | null {
  const raw = process.env.ADMIN_EMAIL?.trim();
  return raw ? raw : null;
}

export function isUserAdmin(userEmail: string | undefined): boolean {
  const admin = getConfiguredAdminEmail();
  if (!admin) return false;
  return userEmail?.toLowerCase() === admin.toLowerCase();
}
