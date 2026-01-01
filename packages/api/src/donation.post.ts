import { API } from "../types/api";
import { Method } from "../types/method";

export class PostDonation extends API {
  constructor(params: { user_id: number; amount: number }) {
    super("/donation", Method.POST, params, {});
  }
}

export interface PostDonationResponse {
  url: string;
}
