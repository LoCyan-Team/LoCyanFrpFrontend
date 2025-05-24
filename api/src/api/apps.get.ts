import { API } from "../type/api";
import { Method } from "../type/method";

export class GetApp extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/apps", Method.GET, params, {});
  }
}

export interface GetAppResponse {
  list: Array<{
    id: number;
    name: string;
    description?: string;
    redirect_url: string;
  }>
}
