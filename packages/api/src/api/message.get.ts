import { API } from "../type/api";
import { Method } from "../type/method";

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
