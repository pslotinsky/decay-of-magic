import { ErrorCode } from './codes';

export type ErrorDetail = {
  code: string;
  field?: string;
  message: string;
};

export type ErrorEnvelope = {
  error: {
    code: ErrorCode | string;
    message: string;
    details?: ErrorDetail[];
  };
};
