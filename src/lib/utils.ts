import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

// Maximum file size in bytes (e.g., 80MB)
export const MAX_FILE_SIZE = 80 * 1024 * 1024;

export function formatDateTime(dateInput: Date) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const dateStr = date.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const timeStr = date.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit'
  });

  return `${dateStr} at ${timeStr}`;
}