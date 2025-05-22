import { API } from "../type/api";
import { Method } from "../type/method";

export class GetVerification extends API {
  constructor(params: { user_id: number }) {
    super("/verification", Method.GET, params, {});
  }
}

export interface GetVerificationResponse {
  limit: {
    real_person_accreditations: number;
  };
  real_name: boolean;
  real_person: boolean;
}
