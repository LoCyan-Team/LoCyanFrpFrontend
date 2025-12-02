import { Method } from "../../type/method";
import { API } from "../../type/api";

export interface PostPaymentResponse {
  /**
   * 支付链接
   */
  url: string;
}

export class PostPayment extends API {
  constructor(params: {
    /**
     * 捐赠 ID
     */
    donation_id: number;
    /**
     * 用户 ID
     */
    user_id: number;
  }) {
    super("/donation/payment", Method.POST, params, {});
  }
}
