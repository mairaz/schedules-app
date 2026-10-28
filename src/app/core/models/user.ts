import { model } from "@angular/core";
import { Availability } from "./availability";

export interface User {
  email: string;
  role: string;
  name: string;
  id: number;
  position: string;
  availability: Availability;
}