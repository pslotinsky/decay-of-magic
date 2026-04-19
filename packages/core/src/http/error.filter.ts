import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ErrorCode } from '../errors/codes';
import { DomainError, ErrorDetail } from '../errors/domain.error';

type ResponseLike = {
  status(code: number): ResponseLike;
  json(body: unknown): void;
};

export type ErrorEnvelope = {
  error: {
    code: ErrorCode | string;
    message: string;
    details?: ErrorDetail[];
  };
};

const CODE_TO_STATUS: Record<ErrorCode, number> = {
  [ErrorCode.BadRequest]: HttpStatus.BAD_REQUEST,
  [ErrorCode.ValidationFailed]: HttpStatus.BAD_REQUEST,
  [ErrorCode.Unauthenticated]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.Forbidden]: HttpStatus.FORBIDDEN,
  [ErrorCode.NotFound]: HttpStatus.NOT_FOUND,
  [ErrorCode.Conflict]: HttpStatus.CONFLICT,
  [ErrorCode.Unprocessable]: HttpStatus.UNPROCESSABLE_ENTITY,
  [ErrorCode.InternalError]: HttpStatus.INTERNAL_SERVER_ERROR,
};

const STATUS_TO_CODE: Record<number, ErrorCode> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.BadRequest,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.Unauthenticated,
  [HttpStatus.FORBIDDEN]: ErrorCode.Forbidden,
  [HttpStatus.NOT_FOUND]: ErrorCode.NotFound,
  [HttpStatus.CONFLICT]: ErrorCode.Conflict,
  [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorCode.Unprocessable,
};

type Mapped = { status: number; envelope: ErrorEnvelope };

@Catch()
export class ErrorFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    const { status, envelope } = this.map(exception);
    host
      .switchToHttp()
      .getResponse<ResponseLike>()
      .status(status)
      .json(envelope);
  }

  private map(exception: unknown): Mapped {
    if (exception instanceof DomainError) {
      return {
        status: CODE_TO_STATUS[exception.code],
        envelope: this.envelope(
          exception.code,
          exception.message,
          exception.details,
        ),
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return {
        status,
        envelope: this.envelope(
          STATUS_TO_CODE[status] ?? ErrorCode.InternalError,
          this.messageOf(exception),
        ),
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      envelope: this.envelope(ErrorCode.InternalError, 'Internal server error'),
    };
  }

  private envelope(
    code: ErrorCode | string,
    message: string,
    details?: ErrorDetail[],
  ): ErrorEnvelope {
    return {
      error: {
        code,
        message,
        ...(details && details.length > 0 ? { details } : {}),
      },
    };
  }

  private messageOf(exception: HttpException): string {
    const body = exception.getResponse();
    if (typeof body === 'string') return body;
    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message: unknown }).message;
      if (typeof message === 'string') return message;
      if (Array.isArray(message)) return message.join('; ');
    }
    return exception.message;
  }
}
