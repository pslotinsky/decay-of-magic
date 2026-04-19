# Gateway service

A classical gateway proxy that sits between clients and services.

<!-- poe:classes:start -->
## Classes

### Classes

```mermaid
classDiagram
  namespace classes {
    class AppModule {
      +configure()
    }
    class JwtMiddleware {
      -JwtService jwtService
      +use()
    }
    class CitizenController {
      +me()
    }
    class HealthController {
      -HealthCheckService health
      +check()
    }
    class SessionController {
      +create()
      +logout()
    }
  }

  AppModule --> JwtMiddleware
  AppModule --> SessionController
```

| Entity | Description |
|--------|-------------|
| [AppModule](src/app.module.ts) | Implements `NestModule` |
| auth/[JwtMiddleware](src/auth/jwt.middleware.ts) | Implements `NestMiddleware` |
| citizen/[CitizenController](src/citizen/citizen.controller.ts) |  |
| health/[HealthController](src/health/health.controller.ts) |  |
| session/[SessionController](src/session/session.controller.ts) |  |
<!-- poe:classes:end -->
