import { Availability } from "./availability";

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  availability: Availability;
  userId?: string;
}
