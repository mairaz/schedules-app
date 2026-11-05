import { Employee } from "./employee";
import { ShiftSchedule } from "./shiftSchedule";
import { SwapApplication, SwapRequest } from "./swap";

export interface SwapApplicationView extends SwapApplication {
  applicant?: Employee;
}

export interface SwapRequestView extends SwapRequest {
  shift?: ShiftSchedule;
  requester?: Employee;
  swapsApplications: SwapApplicationView[];
}
