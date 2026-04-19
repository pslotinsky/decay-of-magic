# Vault service

Manages files: upload, storage, etc

<!-- poe:classes:start -->
## Classes

### Frontier

```mermaid
classDiagram
  namespace frontier {
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

  FileGate --> UploadFileCommand
  FileGate --> File
```

| Entity |
|--------|
| gates/[FileGate](src/frontier/gates/file.gate.ts) |
| gates/[HealthGate](src/frontier/gates/health.gate.ts) |

### Law

```mermaid
classDiagram
  namespace law {
    class UploadFileCommand {
      +File file
    }
    class UploadFileUseCase {
      +execute()
      -createPath()
      -createAbsolutePath()
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
  namespace nestjs_cqrs {
    class Command
  }

  UploadFileCommand --|> Command
  UploadFileCommand *-- File
  UploadFileUseCase --> UploadFileCommand
  UploadFileUseCase --> File
```

| Entity | Description |
|--------|-------------|
| commands/[UploadFileCommand](src/law/commands/upload-file.command.ts) | Extends `Command` |
| commands/[UploadFileUseCase](src/law/commands/upload-file.command.ts) | Implements `ICommandHandler` |

### Lore

```mermaid
classDiagram
  namespace lore {
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
| [File](src/lore/file.entity.ts) |
<!-- poe:classes:end -->
