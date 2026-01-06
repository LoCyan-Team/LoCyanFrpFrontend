import { API } from "../../types/api";
import { Method } from "../../types/method";

export class GetSearch extends API {
  constructor(params: {
    user_id: number;
    keyword: string;
    page: number;
    size: number;
  }) {
    super("/tunnels/search", Method.GET, params, {});
  }
}

export interface GetSearchResponse {
  list: {
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
    proxy_protocol_version: "V1" | "V2" | null;
  }[];
  pagination: {
    count: number;
  };
}
