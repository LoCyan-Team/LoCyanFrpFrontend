import { API } from "../types/api";
import { Method } from "../types/method";

export class GetNode extends API {
  constructor(params: { user_id: number; node_id: number }) {
    super("/node", Method.GET, params, {});
  }
}

export interface GetNodeResponse {
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
  verification_level: string;
}
