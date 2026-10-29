import { DayOfWeek, ShiftPeriod } from "./availability";

export interface ShiftSchedule {
  id: number;
  employeeId: number;
  day: DayOfWeek;
  shift: ShiftPeriod;
  name: string;
}
