import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetThirdParty extends API {
  constructor(params: { user_id: number }) {
    super("/user/third-party", Method.GET, params, {});
  }
}

export interface GetThirdPartyResponse {
  qq: boolean;
}
