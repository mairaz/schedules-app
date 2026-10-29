export type ShiftPeriod = "morning" | "afternoon" | "evening" | "night";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface DayAvailability {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  night: boolean;
  unavailable: boolean;
}

export type Availability = Record<DayOfWeek, DayAvailability>;

export const SHIFTS = ["morning", "afternoon", "evening", "night"] as const;
export const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;