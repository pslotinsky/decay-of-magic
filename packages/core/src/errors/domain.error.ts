import { ErrorCode } from './codes';

export type ErrorDetail = {
  code: string;
  field?: string;
  message: string;
};

/**
 * Base class for errors raised by the domain and application layers.
 * Frontier-level code (HTTP filters, RPC handlers) maps these to transport responses.
 */
export abstract class DomainError extends Error {
  public abstract readonly code: ErrorCode;
  public readonly details?: ErrorDetail[];

  constructor(message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = new.target.name;
    this.details = details;
  }
}
