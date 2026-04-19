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

| Use case | Description |
|----------|-------------|
| [UploadFileCommand](src/law/commands/upload-file.command.ts) | Params: `(file: File)`<br>Returns: `FileDto` |

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
