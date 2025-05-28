import { API } from "../type/api";
import { Method } from "../type/method";

export class GetTunnels extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/tunnels", Method.GET, params, {});
  }
}

export interface GetTunnelsResponse {
  list: Array<{
    domain: null | string;
    /**
     * 隧道 ID
     */
    id: number;
    local_ip: string;
    local_port: number;
    locations: null | string[];
    name: string;
    node: {
      host: null | string;
      /**
       * ID
       */
      id: number;
      ip: null | string;
      name: null | string;
    };
    remote_port: number | null;
    secret_key: string;
    status: string;
    type: string;
    use_compression: boolean;
    use_encryption: boolean;
  }>;
  pagination: {
    count: number;
  };
}
