import { API } from "../../../types/api";
import { Method } from "../../../types/method";

export class PostPayment extends API {
  constructor(params: { user_id: number }) {
    super("/verification/real-person/payment", Method.POST, params, {});
  }
}

export interface PostPaymentResponse {
  url: string;
}
