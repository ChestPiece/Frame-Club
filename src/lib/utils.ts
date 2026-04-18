import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** True when `pathname` equals `href` or is nested under it (e.g. `/shop/foo` under `/shop`). */
export function isPrefixActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isExactActive(pathname: string, href: string): boolean {
  return pathname === href;
}

export function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Pakistani Rupees, no decimals (integer PKR). */
export function formatPkr(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}
