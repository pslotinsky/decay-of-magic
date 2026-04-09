# Vault service

Manages files: upload, storage, etc

<!-- poe:classes:start -->
## Classes

### api

```mermaid
classDiagram
  namespace api {
    class FileController {
      -CommandBus commandBus
      +upload()
    }
    class UploadFileDto {
      +string id
      +string category
      +string file
    }
  }
  namespace application {
    class UploadFileCommand {
      +File file
    }
  }
  namespace domain {
    class File {
      +string id
      +string category
      +string name
      +Buffer buffer
      +string mimetype
    }
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
    class UploadFileCommand {
      +File file
    }
    class UploadFileUseCase {
      -string bucket
      -S3 client
      +execute()
      -createPath()
      -createAbsolutePath()
      -createBucket()
      -createClient()
    }
  }
  namespace domain {
    class File {
      +string id
      +string category
      +string name
      +Buffer buffer
      +string mimetype
    }
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
    class File {
      +string id
      +string category
      +string name
      +Buffer buffer
      +string mimetype
    }
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
