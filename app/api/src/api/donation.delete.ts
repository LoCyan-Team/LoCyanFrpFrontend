import { Method } from "../type/method";
import { API } from "../type/api";

export class DeleteDonation extends API {
  constructor(params: {
    /**
     * 用户 ID
     */
    user_id: number;
    /**
     * 捐赠 ID
     */
    donation_id: number;
  }) {
    super("/donation", Method.DELETE, params, {});
  }
}