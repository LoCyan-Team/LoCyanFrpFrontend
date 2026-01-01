import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetNotice extends API {
  constructor() {
    super("/site/notice", Method.GET, {}, {});
  }
}

export interface GetNoticeResponse {
  broadcast: string;
  announcement: string;
}
