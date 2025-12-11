import { API } from "../../../type/api";
import { Method } from "../../../type/method";

export class GetSystem extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/site/notification/system", Method.GET, params, {});
  }
}

export interface GetSystemResponse {
  list: {
    id: number;
    title: string;
    content: string;
    create_time: string;
    read_time: string | null;
  }[];
  pagination: {
    count: number;
  };
}
