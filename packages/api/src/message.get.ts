import { API } from "../types/api";
import { Method } from "../types/method";

export class GetMessage extends API {
  constructor(params: { user_id: number }) {
    super("/message", Method.GET, params, {});
  }
}

export interface GetMessageResponse {
  list: {
    context: string;
    id: number;
    time: string;
    username: string;
  }[];
}
