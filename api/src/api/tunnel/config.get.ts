import { API } from "../../type/api";
import { Method } from "../../type/method";

export class GetConfig extends API {
  constructor(params: {
    user_id: number;
    tunnel_id: number | undefined;
    node_id: number | undefined;
  }) {
    super("/tunnel/config", Method.GET, params, {});
  }
}
