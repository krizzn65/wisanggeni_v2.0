import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fungsi helper untuk menggabungkan class Tailwind tanpa duplikasi.
 * Contoh: cn("p-2", kondisi && "bg-red-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
