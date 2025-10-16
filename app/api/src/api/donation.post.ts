import { API } from "../type/api";
import { Method } from "../type/method";

export class PostDonation extends API {
  constructor(params: {
    user_id: number;
    amount: number;
  }) {
    super("/donation", Method.POST, params, {});
  }
}

export interface PostDonationResponse {
  url: string;
}
