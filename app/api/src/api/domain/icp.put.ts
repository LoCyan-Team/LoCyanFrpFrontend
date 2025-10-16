import { API } from "../../type/api";
import { Method } from "../../type/method";

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
