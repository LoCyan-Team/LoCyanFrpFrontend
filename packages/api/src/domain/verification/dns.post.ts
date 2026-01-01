import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class PostDns extends API {
  constructor(params: { user_id: number; domain: string }) {
    super("/domain/verification/dns", Method.POST, params, {});
  }
}
