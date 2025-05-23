import { API } from "../type/api";
import { Method } from "../type/method";

export class GetDonations extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/donations", Method.GET, params, {});
  }
}
