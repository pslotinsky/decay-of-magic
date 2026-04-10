# Vault service

Manages files: upload, storage, etc

<!-- poe:classes:start -->
## Classes

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
  namespace root {
    class AppModule
  }
  namespace nestjs_cqrs {
    class Command
  }

  FileController --> UploadFileDto
  FileController --> UploadFileCommand
  FileController --> File
  UploadFileCommand --|> Command
  UploadFileCommand *-- File
  UploadFileUseCase --> UploadFileCommand
  UploadFileUseCase --> File
```

| Entity | Notes |
|--------|-------|
| api/controllers/[FileController](src/api/controllers/file.controller.ts) |  |
| api/dto/[UploadFileDto](src/api/dto/upload-file.dto.ts) |  |
| application/commands/[UploadFileCommand](src/application/commands/upload-file.command.ts) | Extends `Command` |
| application/commands/[UploadFileUseCase](src/application/commands/upload-file.command.ts) | Implements `ICommandHandler` |
| domain/[File](src/domain/file.entity.ts) |  |
| [AppModule](src/app.module.ts) |  |
<!-- poe:classes:end -->
