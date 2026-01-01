import { API } from "../types/api";
import { Method } from "../types/method";

export class PatchApp extends API {
  constructor(params: {
    user_id: number;
    app_id: number;
    name?: string;
    description?: string;
    redirect_url?: string;
  }) {
    super("/app", Method.PATCH, params, {});
  }
}
