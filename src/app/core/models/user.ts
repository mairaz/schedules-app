import { model } from "@angular/core";
import { Availability } from "./availability";

export interface User {
  email: string;
  role: string;
  name: string;
  id: string;
  position: string;
  availability: Availability;
}