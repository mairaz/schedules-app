export type Shift = "morning" | "afternoon" | "evening" | "night";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type Availability = Record<DayOfWeek, Shift[]>;

export const SHIFTS = ["morning", "afternoon", "evening", "night"] as const;
export const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;