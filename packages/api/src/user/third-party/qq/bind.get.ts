import { API } from "../../../../types/api";
import { Method } from "../../../../types/method";

export class GetBind extends API {
  constructor(params: { user_id: number }) {
    super("/user/third-party/qq/bind", Method.GET, params, {});
  }
}

export interface GetBindResponse {
  url: string;
}
