import { API } from "../../type/api";
import { Method } from "../../type/method";

export class Login extends API {
  constructor(params: Record<string, unknown>) {
    super("/auth/login", Method.POST, params);
  }
}
