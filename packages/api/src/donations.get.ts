import { API } from "../types/api";
import { Method } from "../types/method";

export class GetDonations extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/donations", Method.GET, params, {});
  }
}

export interface GetDonationsResponse {
  list: {
    id: number;
    message: string | null;
    trade_no: string;
    pay_type: string;
    amount: number;
    time: string;
    status: string;
  }[];
  pagination: {
    count: number;
  };
}
