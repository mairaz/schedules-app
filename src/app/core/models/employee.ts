import { Availability } from "./availability";

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  availability: Availability;
  userId?: string;
}
