export type SuccessEnvelope<TData, TMeta = Record<string, unknown>> = {
  data: TData;
  meta?: TMeta;
};

/**
 * Extract the `data` payload from a success envelope.
 * Use in tests and typed clients. Throws if the body is not a valid envelope.
 */
export function unwrap<TData>(body: unknown): TData {
  if (typeof body !== 'object' || body === null || !('data' in body)) {
    throw new TypeError('Response body is not a success envelope');
  }

  return (body as { data: TData }).data;
}
