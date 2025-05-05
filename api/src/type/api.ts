import type { Method } from "./method";

export abstract class API {
  protected constructor(
    public readonly endpoint: string,
    public readonly method: Method,
    public readonly params: Record<string, unknown>,
    public readonly headers?: Record<string, string>,
  ) {}
}
