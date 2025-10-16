import { API } from "../type/api";
import { Method } from "../type/method";

export class PutApp extends API {
  constructor(params: {
    user_id: number;
    name: string;
    description?: string;
    redirect_url: string;
  }) {
    super("/app", Method.PUT, params, {});
  }
}

export interface PutAppResponse {
  app_id: number;
}
