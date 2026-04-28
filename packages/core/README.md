# @dod/core

<!-- poe:classes:start -->
## Classes

### Classes

```mermaid
classDiagram
  namespace classes {
    class Entity {
      +update()
    }
    class BadRequestError
    class ConflictError
    class DomainError {
      +ErrorDetail details
    }
    class ForbiddenError
    class NotFoundError
    class UnauthenticatedError
    class UnprocessableError
    class ValidationFailedError
    class EnvelopeInterceptor {
      -Reflector reflector
      +intercept()
    }
    class ErrorFilter {
      +catch()
      -map()
      -envelope()
      -messageOf()
    }
    class ZodPipe {
      -TSchema schema
      +transform()
    }
    class EntityRepository {
      +getById()
      +getByIdOrFail()
      +find()
      +findOne()
      +save()
      +findOneOrFail()
    }
    class InMemoryRepository {
      +getById()
      +getByIdOrFail()
      +find()
      +findOne()
      +save()
      #key()
      #matches()
    }
    class PrismaRepository {
      +getById()
      +getByIdOrFail()
      +find()
      +findOne()
      +save()
      #toEntity()
      #toModel()
    }
  }

  BadRequestError --|> DomainError
  ConflictError --|> DomainError
  DomainError --|> Error
  ForbiddenError --|> DomainError
  NotFoundError --|> DomainError
  UnauthenticatedError --|> DomainError
  UnprocessableError --|> DomainError
  ValidationFailedError --|> DomainError
  ErrorFilter --> DomainError
  ZodPipe --> ValidationFailedError
  EntityRepository --> Entity
  EntityRepository --> NotFoundError
  InMemoryRepository --> Entity
  InMemoryRepository --> NotFoundError
  InMemoryRepository --> EntityRepository
  PrismaRepository --> Entity
  PrismaRepository --> NotFoundError
  PrismaRepository --> EntityRepository
```

| Entity | Description |
|--------|-------------|
| [Entity](src/entity.ts) | Abstract |
| errors/[BadRequestError](src/errors/bad-request.error.ts) | Signals a malformed or unacceptable request that doesn't fit the more<br>specific domain errors.<br><br>Extends [DomainError](src/errors/domain.error.ts) |
| errors/[ConflictError](src/errors/conflict.error.ts) | Signals that the operation conflicts with current state, such as a duplicate<br>identifier or a concurrent modification.<br><br>Extends [DomainError](src/errors/domain.error.ts) |
| errors/[DomainError](src/errors/domain.error.ts) | Base class for errors raised by the domain and application layers.<br>Frontier-level code (HTTP filters, RPC handlers) maps these to transport responses.<br><br>Abstract · Extends `Error` |
| errors/[ForbiddenError](src/errors/forbidden.error.ts) | Signals that the caller is authenticated but not authorized for the<br>requested operation.<br><br>Extends [DomainError](src/errors/domain.error.ts) |
| errors/[NotFoundError](src/errors/not-found.error.ts) | Signals that the requested resource does not exist.<br><br>Extends [DomainError](src/errors/domain.error.ts) |
| errors/[UnauthenticatedError](src/errors/unauthenticated.error.ts) | Signals that the caller is not authenticated.<br><br>Extends [DomainError](src/errors/domain.error.ts) |
| errors/[UnprocessableError](src/errors/unprocessable.error.ts) | Signals that the request is well-formed but rejected on semantic grounds —<br>a domain rule prevents the operation from completing.<br><br>Extends [DomainError](src/errors/domain.error.ts) |
| errors/[ValidationFailedError](src/errors/validation-failed.error.ts) | Signals that input failed schema validation. Carries per-field details so<br>callers can surface structured feedback.<br><br>Extends [DomainError](src/errors/domain.error.ts) |
| http/[EnvelopeInterceptor](src/http/envelope.interceptor.ts) | Implements `NestInterceptor` |
| http/[ErrorFilter](src/http/error.filter.ts) | Implements `ExceptionFilter` |
| http/[ZodPipe](src/http/zod.pipe.ts) |  |
| repositories/[EntityRepository](src/repositories/entity.repository.ts) | Abstract base for domain repositories. Defines the standard CRUD contract<br>that all entity repositories must implement.<br><br>Abstract |
| repositories/[InMemoryRepository](src/repositories/in-memory.repository.ts) | In-memory implementation of EntityRepository. Provides getById, find, and<br>save via a per-instance Map; intended for tests and prototypes where<br>persistence is out of scope.<br><br>Abstract |
| repositories/[PrismaRepository](src/repositories/prisma.repository.ts) | Prisma-backed implementation of EntityRepository. Provides getById, find,<br>and save via a model delegate, handling entity↔model mapping via subclasses.<br><br>Abstract |
<!-- poe:classes:end -->
