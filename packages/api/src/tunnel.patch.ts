import { API } from "../types/api";
import { Method } from "../types/method";

export class PatchTunnel extends API {
  constructor(params: {
    user_id: number;
    tunnel_id: number;
    name?: string;
    type?: string;
    local_ip?: string;
    local_port?: number;
    remote_port?: number;
    use_encryption?: boolean;
    use_compression?: boolean;
    node_id?: number;
    secret_key?: string;
    domain?: string;
    locations?: string[];
    proxy_protocol_version?: "V1" | "V2";
  }) {
    super("/tunnel", Method.PATCH, params, {});
  }
}
