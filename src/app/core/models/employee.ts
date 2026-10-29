import { Availability } from "./availability";

export interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  availability: Availability;
  userId?: string;
}
