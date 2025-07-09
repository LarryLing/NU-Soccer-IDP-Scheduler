import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.slice(0, -2).split(":").map(Number);
  const period = timeStr.slice(-2).toUpperCase();

  let totalHours = hours ?? 0;
  if (period === "AM" && (hours ?? 0) === 12) {
    totalHours = 0;
  } else if (period === "PM" && (hours ?? 0) !== 12) {
    totalHours = (hours ?? 0) + 12;
  }

  return totalHours * 60 + (minutes ?? 0);
};
