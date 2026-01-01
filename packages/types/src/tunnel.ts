import type { ProxyProtocolVersion } from "./tunnel/proxyProtocolVersion";

export interface Tunnel {
  id: number;
  name: string;
  type: string;
  node: {
    id: number;
    name: string | null;
    host: string | null;
    ip: string | null;
  };
  localIp: string;
  localPort: number;
  remotePort: number | null;
  useEncryption: boolean;
  useCompression: boolean;
  domain: string | null;
  locations: string[] | null;
  status: string;
  proxyProtocolVersion: ProxyProtocolVersion | null;
}
