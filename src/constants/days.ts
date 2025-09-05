export const MONDAY = "Monday" as const;
export const TUESDAY = "Tuesday" as const;
export const WEDNESDAY = "Wednesday" as const;
export const THURSDAY = "Thursday" as const;
export const FRIDAY = "Friday" as const;

export type Day = typeof MONDAY | typeof TUESDAY | typeof WEDNESDAY | typeof THURSDAY | typeof FRIDAY;

export const DAYS = [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY] as const;
