export type SwapStatus = 'pending' | 'approved' | 'rejected';


export interface SwapRequest {
  id: string;
  shiftId: string;
  status: SwapStatus;
}

export interface SwapApplication {
  id: string;
  swapsRequestId: string;
  employeeId: string;
  status: SwapStatus;
}

export type CreateSwapRequest = Omit<SwapRequest, 'id'>;
export type CreateSwapApplication = Omit<SwapApplication, 'id'>;
