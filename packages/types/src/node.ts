export interface Node {
  id: number;
  name: string;
  description: string | null;
  host: string;
  ip: string | null;
  portRange: string[];
  additional: {
    allowUdp: boolean;
    allowHttp: boolean;
    allowBigTraffic: boolean;
    needIcp: boolean;
  };
  verificationLevel: string;
}
