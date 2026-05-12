/**
 * A single HTTP endpoint exposed by a controller
 */
export class Endpoint {
  constructor(
    public readonly file: string,
    public readonly layer: string,
    public readonly className: string,
    public readonly method: string,
    public readonly path: string,
    public readonly handler: string,
    public readonly params: readonly string[] = [],
    public readonly returns?: string,
    public readonly description?: string,
  ) {}
}
