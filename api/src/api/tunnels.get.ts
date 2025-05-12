import { API } from "../type/api";
import { Method } from "../type/method";

export class GetTunnels extends API {
  constructor(params: { user_id: number; page: number; size: number }) {
    super("/tunnels", Method.GET, params, {});
  }
}

export interface GetTunnelsData {
    list: List[];
    pagination: Pagination;
}

export interface List {
    domain: null | string;
    /**
     * 隧道 ID
     */
    id: number;
    local_ip: string;
    local_port: number;
    locations: null | string;
    name: string;
    node: Node;
    remote_port: number | null;
    secret_key: string;
    status: number;
    type: string;
    use_compression: boolean;
    use_encryption: boolean;
}

export interface Node {
    host: null | string;
    /**
     * ID
     */
    id: number;
    ip: null | string;
    name: null | string;
}

export interface Pagination {
    /**
     * 总页数
     */
    count: number;
}