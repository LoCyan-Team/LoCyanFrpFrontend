import { API } from "../../../../type/api";
import { Method } from "../../../../type/method"; 

export class GetQQLogin extends API {
  constructor() {
    super("/auth/third-party/qq/login", Method.GET, {}, {});
  }
}


export interface GetQQLoginResponse {
  url:string
}