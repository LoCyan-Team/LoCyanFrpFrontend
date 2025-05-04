import { API } from "../type/api";
import { Method } from "../type/method";

export class PatchTunnel extends API {
  constructor(params: {
    user_id: number;
    tunnel_id: number;
    name: string | undefined;
    type: string | undefined;
    local_ip: string | undefined;
    local_port: number | undefined;
    remote_port: number | undefined;
    use_encryption: boolean | undefined;
    use_compression: boolean | undefined;
    node_id: number | undefined;
    secret_key: string | undefined;
    domain: string | undefined;
    locations: string[] | undefined;
  }) {
    super("/tunnel", Method.PATCH, params, {});
  }
}
