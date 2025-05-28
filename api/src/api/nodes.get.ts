import { API } from "../type/api";
import { Method } from "../type/method";

export class GetNodes extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/nodes", Method.GET, params, {});
  }
}

export interface GetNodesResponse {
  list: Array<{
    name: string;
    id: number;
    host: string;
    ip: string | null;
    description: string | null;
    server_port: number;
    port_range: string[];
    additional: {
      allow_big_traffic: boolean;
      allow_udp: boolean;
      allow_http: boolean;
      need_icp: boolean;
    };
  }>;
  pagination: {
    count: number;
  };
}
