import { SetMetadata } from '@nestjs/common';

export const NO_ENVELOPE_KEY = 'dod:no-envelope';

/**
 * Marks a controller method whose response should bypass the envelope interceptor.
 * Use for endpoints with a fixed, externally-defined shape — health probes, metrics, webhooks.
 */
export const NoEnvelope = (): MethodDecorator =>
  SetMetadata(NO_ENVELOPE_KEY, true);
