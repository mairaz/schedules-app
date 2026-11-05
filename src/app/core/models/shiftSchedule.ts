import { DayOfWeek, ShiftPeriod } from "./availability";

export interface ShiftSchedule {
  id: string;
  employeeId: string;
  day: DayOfWeek;
  shift: ShiftPeriod;
}

export type CreateShiftSchedule = Omit<ShiftSchedule, 'id'>;