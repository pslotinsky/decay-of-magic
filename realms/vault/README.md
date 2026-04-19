# Vault service

Manages files: upload, storage, etc

<!-- poe:classes:start -->
## Classes

```mermaid
classDiagram
  namespace frontier {
    class FileDto {
      +string id
      +string category
      +string name
      +string mimetype
      +string url
    }
    class UploadFileDto {
      +string id
      +string category
      +string file
    }
    class FileGate {
      -CommandBus commandBus
      +upload()
    }
    class HealthGate {
      -HealthCheckService health
      +check()
    }
  }
  namespace law {
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
  namespace lore {
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

  FileDto --> File
  FileGate --> FileDto
  FileGate --> UploadFileDto
  FileGate --> UploadFileCommand
  FileGate --> File
  UploadFileCommand --|> Command
  UploadFileCommand *-- File
  UploadFileCommand --> FileDto
  UploadFileUseCase --> FileDto
  UploadFileUseCase --> UploadFileCommand
  UploadFileUseCase --> File
```

| Entity | Notes |
|--------|-------|
| frontier/dto/[FileDto](src/frontier/dto/file.dto.ts) |  |
| frontier/dto/[UploadFileDto](src/frontier/dto/upload-file.dto.ts) |  |
| frontier/gates/[FileGate](src/frontier/gates/file.gate.ts) |  |
| frontier/gates/[HealthGate](src/frontier/gates/health.gate.ts) |  |
| law/commands/[UploadFileCommand](src/law/commands/upload-file.command.ts) | Extends `Command` |
| law/commands/[UploadFileUseCase](src/law/commands/upload-file.command.ts) | Implements `ICommandHandler` |
| lore/[File](src/lore/file.entity.ts) |  |
| [AppModule](src/app.module.ts) |  |
<!-- poe:classes:end -->
