# Vault service

Manages files: upload, storage, etc

<!-- poe:class-table:start -->
### api

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [FileController](src/api/controllers/file.controller.ts) |  |  |
| [UploadFileDto](src/api/dto/upload-file.dto.ts) |  |  |

### root

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [AppModule](src/app.module.ts) |  |  |

### application

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [UploadFileCommand](src/application/commands/upload-file.command.ts) |  | Extends Command |
| [UploadFileUseCase](src/application/commands/upload-file.command.ts) |  | Implements ICommandHandler |

### domain

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [File](src/domain/file.entity.ts) |  |  |
<!-- poe:class-table:end -->
