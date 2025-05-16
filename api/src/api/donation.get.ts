import { API } from "../type/api";
import { Method } from "../type/method";

export class GetDonation extends API {
  constructor(params: { user_id: number; donation_id: number }) {
    super("/donation", Method.GET, params, {});
  }
}
