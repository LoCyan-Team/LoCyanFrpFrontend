import { API } from "../../../../type/api";
import { Method } from "../../../../type/method"; 

export class PostQQLogin extends API {
  constructor(params:{code:string}) {
    super("/auth/third-party/qq/login", Method.POST, params, {});
  }
}
