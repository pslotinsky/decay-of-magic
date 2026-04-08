# Vault service

Manages files: upload, storage, etc

<!-- poe:class-table:start -->
## Classes

### api

| Entity |
|--------|
| controllers/[FileController](src/api/controllers/file.controller.ts) |
| dto/[UploadFileDto](src/api/dto/upload-file.dto.ts) |

### application

| Entity | Notes |
|--------|-------|
| commands/[UploadFileCommand](src/application/commands/upload-file.command.ts) | Extends `Command` |
| commands/[UploadFileUseCase](src/application/commands/upload-file.command.ts) | Implements `ICommandHandler` |

### domain

| Entity |
|--------|
| [File](src/domain/file.entity.ts) |

### root

| Entity |
|--------|
| [AppModule](src/app.module.ts) |
<!-- poe:class-table:end -->

<!-- poe:class-diagram:start -->
## Class Diagram

```mermaid
classDiagram
  namespace api {
    class FileController
    class UploadFileDto
  }

  namespace application {
    class UploadFileCommand
    class UploadFileUseCase
  }

  namespace domain {
    class File
  }

  namespace root {
    class AppModule
  }

  FileController --> UploadFileDto
  FileController --> UploadFileCommand
  FileController --> File
  UploadFileCommand *-- File
  UploadFileUseCase --> UploadFileCommand
  UploadFileUseCase --> File
```
<!-- poe:class-diagram:end -->
