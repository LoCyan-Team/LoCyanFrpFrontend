import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class PostPayment extends API {
  constructor(params: { user_id: number }) {
    super("/verification/real-person/payment", Method.POST, params, {});
  }
}

export interface PostPaymentResponse {
  url: string;
}
