export const GOALKEEPER = "Goalkeeper" as const;
export const DEFENDER = "Defender" as const;
export const MIDFIELDER = "Midfielder" as const;
export const FORWARD = "Forward" as const;

export type Position = typeof GOALKEEPER | typeof DEFENDER | typeof MIDFIELDER | typeof FORWARD;

export const POSITIONS = [GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD] as const;
