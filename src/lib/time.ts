import type { Day } from "@/constants/days";

export const calculateMinutesFromTimeString = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (hours === undefined || minutes === undefined) return 0;
  return hours * 60 + minutes;
};

export const getTimeStringWithoutMeridian = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const getTimeStringWithMeridian = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, "0")}${hours >= 12 ? "PM" : "AM"}`;
};

export const getDayAbbreviation = (day: Day) => {
  switch (day) {
    case "Monday":
      return "Mo";
    case "Tuesday":
      return "Tu";
    case "Wednesday":
      return "We";
    case "Thursday":
      return "Th";
    case "Friday":
      return "Fr";
  }
};
