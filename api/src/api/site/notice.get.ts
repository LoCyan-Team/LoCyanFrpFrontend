import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetNotice extends API {
  constructor() {
    super("/site/notice", Method.GET, {}, {});
  }
}
