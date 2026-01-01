import { API } from "../types/api";
import { Method } from "../types/method";

export class GetApps extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/apps", Method.GET, params, {});
  }
}

export interface GetAppsResponse {
  list: {
    id: number;
    name: string;
    description?: string;
    redirect_url: string;
  }[];
  pagination: {
    count: number;
  };
}
