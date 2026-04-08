# Vault service

Manages files: upload, storage, etc

<!-- poe:classes:start -->
## Classes

### api

```mermaid
classDiagram
  namespace api {
    class FileController
    class UploadFileDto
  }
  namespace application {
    class UploadFileCommand
  }
  namespace domain {
    class File
  }

  FileController --> UploadFileDto
  FileController --> UploadFileCommand
  FileController --> File
```

| Entity |
|--------|
| controllers/[FileController](src/api/controllers/file.controller.ts) |
| dto/[UploadFileDto](src/api/dto/upload-file.dto.ts) |

### application

```mermaid
classDiagram
  namespace application {
    class UploadFileCommand
    class UploadFileUseCase
  }
  namespace domain {
    class File
  }
  namespace nestjs_cqrs {
    class Command
  }

  UploadFileCommand --|> Command
  UploadFileCommand *-- File
  UploadFileUseCase --> UploadFileCommand
  UploadFileUseCase --> File
```

| Entity | Notes |
|--------|-------|
| commands/[UploadFileCommand](src/application/commands/upload-file.command.ts) | Extends `Command` |
| commands/[UploadFileUseCase](src/application/commands/upload-file.command.ts) | Implements `ICommandHandler` |

### domain

```mermaid
classDiagram
  namespace domain {
    class File
  }

```

| Entity |
|--------|
| [File](src/domain/file.entity.ts) |

### root

```mermaid
classDiagram
  namespace root {
    class AppModule
  }

```

| Entity |
|--------|
| [AppModule](src/app.module.ts) |
<!-- poe:classes:end -->
