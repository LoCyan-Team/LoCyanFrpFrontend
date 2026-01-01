import { API } from "../../types/api";
import { Method } from "../../types/method";

export class PutIcp extends API {
  constructor(params: {
    user_id: number;
    domain_id: number;
    miit_sign: string;
    miit_token: string;
    miit_token_uuid: string;
  }) {
    super("/domain/icp", Method.PUT, params, {});
  }
}

export interface PutIcpResponse {
  id: number;
  icp: string;
  unit_name: string;
  nature_name: string;
}
