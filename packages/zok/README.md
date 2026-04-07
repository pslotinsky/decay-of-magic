# zok

<!-- poe:class-table:start -->
### application

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [Zok](src/application/Zok.ts) |  |  |
| [ChangeStatusDutyInstruction](src/application/instructions/ChangeStatusDutyInstruction.ts) |  | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| [CreateDocumentDutyInstruction](src/application/instructions/CreateDocumentDutyInstruction.ts) |  | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| [DeleteDocumentDutyInstruction](src/application/instructions/DeleteDocumentDutyInstruction.ts) |  | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| [DutyInstruction](src/application/instructions/DutyInstruction.ts) |  | Abstract |
| [ListDocumentsDutyInstruction](src/application/instructions/ListDocumentsDutyInstruction.ts) |  | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| [MoveDocumentDutyInstruction](src/application/instructions/MoveDocumentDutyInstruction.ts) |  | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| [RenameDocumentDutyInstruction](src/application/instructions/RenameDocumentDutyInstruction.ts) |  | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| [UpdateDocumentRelationsDutyInstruction](src/application/instructions/UpdateDocumentRelationsDutyInstruction.ts) |  | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| [UpdateReadmeDutyInstruction](src/application/instructions/UpdateReadmeDutyInstruction.ts) |  | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |

### domain

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [ArchiveKeeper](src/domain/assistants/ArchiveKeeper.ts) |  | Abstract · Extends [Assistant](src/domain/assistants/Assistant.ts) |
| [Assistant](src/domain/assistants/Assistant.ts) |  | Abstract |
| [HumorAdvisor](src/domain/assistants/HumorAdvisor.ts) |  | Extends [Assistant](src/domain/assistants/Assistant.ts) |
| [PleaFormalist](src/domain/assistants/PleaFormalist.ts) |  | Abstract · Extends [Assistant](src/domain/assistants/Assistant.ts) |
| [ProtocolClerk](src/domain/assistants/ProtocolClerk.ts) |  | Abstract · Extends [Assistant](src/domain/assistants/Assistant.ts) |
| [Scribe](src/domain/assistants/Scribe.ts) |  | Abstract · Extends [Assistant](src/domain/assistants/Assistant.ts) |
| [Document](src/domain/entities/Document.ts) |  |  |
| [DocumentLink](src/domain/entities/DocumentLink.ts) |  |  |
| [DocumentProtocol](src/domain/entities/DocumentProtocol.ts) |  |  |
| [Dossier](src/domain/entities/Dossier.ts) |  |  |
| [Plea](src/domain/entities/Plea.ts) |  |  |
| [Remark](src/domain/entities/Remark.ts) |  |  |
| [MalformedDocumentError](src/domain/errors/MalformedDocumentError.ts) |  | Extends Error |
| [NotFoundError](src/domain/errors/NotFoundError.ts) |  |  |
| [UnexpectedValueError](src/domain/errors/UnexpectedValueError.ts) |  | Extends Error |
| [Archive](src/domain/tools/Archive.ts) |  | Abstract |
| [DocumentParser](src/domain/tools/parser/DocumentParser.ts) |  |  |
| [DocumentTocLineParser](src/domain/tools/parser/DocumentTocLineParser.ts) |  |  |
| [DocumentTocParser](src/domain/tools/parser/DocumentTocParser.ts) |  |  |
| [TextExtractor](src/domain/tools/parser/TextExtractor.ts) |  |  |
| [DocumentTocRender](src/domain/tools/render/DocumentTocRender.ts) |  |  |

### infrastructure

| Entity | Description | Notes |
| ------ | ----------- | ----- |
| [FileSystemArchive](src/infrastructure/archive/FileSystemArchive.ts) |  | Extends [Archive](src/domain/tools/Archive.ts) |
| [FileSystemArchiveKeeper](src/infrastructure/assistants/FileSystemArchiveKeeper.ts) |  | Extends [ArchiveKeeper](src/domain/assistants/ArchiveKeeper.ts) |
| [NanoPleaFormalist](src/infrastructure/assistants/NanoPleaFormalist.ts) |  | Extends [PleaFormalist](src/domain/assistants/PleaFormalist.ts) |
| [NunjucksScribe](src/infrastructure/assistants/NunjucksScribe.ts) |  | Extends [Scribe](src/domain/assistants/Scribe.ts) |
| [YamlProtocolClerk](src/infrastructure/assistants/YamlProtocolClerk.ts) |  | Extends [ProtocolClerk](src/domain/assistants/ProtocolClerk.ts) |
<!-- poe:class-table:end -->
