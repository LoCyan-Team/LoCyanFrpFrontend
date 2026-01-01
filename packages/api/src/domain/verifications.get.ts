import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetVerifications extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/domain/verifications", Method.GET, params, {});
  }
}

export interface GetVerificationsResponse {
  list: {
    domain: string;
    record_type: string;
    record_data: string;
  }[];
  pagination: {
    count: number;
  };
}
