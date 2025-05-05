import { API } from "../type/api";
import { Method } from "../type/method";

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
  }) {
    super("/tunnel", Method.PATCH, params, {});
  }
}
