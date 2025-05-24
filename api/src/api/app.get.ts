import { API } from "../type/api";
import { Method } from "../type/method";

export class GetApp extends API {
  constructor(params: { user_id: number; app_id: number }) {
    super("/app", Method.GET, params, {});
  }
}

export interface GetAppResponse {
  name: string;
  description?: string;
  redirect_url: string;
}
