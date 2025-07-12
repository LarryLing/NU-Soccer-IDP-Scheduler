import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (hours === undefined || minutes === undefined) return 0;
  return hours * 60 + minutes;
};

export const formatTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

export const formatTimeWithPeriod = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, "0")}${hours >= 12 ? "PM" : "AM"}`;
};
