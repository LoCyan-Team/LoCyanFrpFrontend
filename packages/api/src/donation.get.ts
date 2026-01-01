import { API } from "../types/api";
import { Method } from "../types/method";

export class GetDonation extends API {
  constructor(params: { user_id: number; donation_id: number }) {
    super("/donation", Method.GET, params, {});
  }
}
