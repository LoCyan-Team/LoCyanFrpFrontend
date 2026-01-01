import { API } from "../../../../types/api";
import { Method } from "../../../../types/method";

export class GetLogin extends API {
  constructor() {
    super("/auth/third-party/qq/login", Method.GET, {}, {});
  }
}

export interface GetLoginResponse {
  url: string;
}
