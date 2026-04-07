# zok

<!-- poe:class-table:start -->
### application

| Entity | Notes |
|--------|-------|
| [Zok](src/application/Zok.ts) |  |
| instructions/[ChangeStatusDutyInstruction](src/application/instructions/ChangeStatusDutyInstruction.ts) | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| instructions/[CreateDocumentDutyInstruction](src/application/instructions/CreateDocumentDutyInstruction.ts) | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| instructions/[DeleteDocumentDutyInstruction](src/application/instructions/DeleteDocumentDutyInstruction.ts) | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| instructions/[DutyInstruction](src/application/instructions/DutyInstruction.ts) | Abstract |
| instructions/[ListDocumentsDutyInstruction](src/application/instructions/ListDocumentsDutyInstruction.ts) | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| instructions/[MoveDocumentDutyInstruction](src/application/instructions/MoveDocumentDutyInstruction.ts) | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| instructions/[RenameDocumentDutyInstruction](src/application/instructions/RenameDocumentDutyInstruction.ts) | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| instructions/[UpdateDocumentRelationsDutyInstruction](src/application/instructions/UpdateDocumentRelationsDutyInstruction.ts) | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |
| instructions/[UpdateReadmeDutyInstruction](src/application/instructions/UpdateReadmeDutyInstruction.ts) | Extends [DutyInstruction](src/application/instructions/DutyInstruction.ts) |

### domain

| Entity | Notes |
|--------|-------|
| assistants/[ArchiveKeeper](src/domain/assistants/ArchiveKeeper.ts) | Abstract · Extends [Assistant](src/domain/assistants/Assistant.ts) |
| assistants/[Assistant](src/domain/assistants/Assistant.ts) | Abstract |
| assistants/[HumorAdvisor](src/domain/assistants/HumorAdvisor.ts) | Extends [Assistant](src/domain/assistants/Assistant.ts) |
| assistants/[PleaFormalist](src/domain/assistants/PleaFormalist.ts) | Abstract · Extends [Assistant](src/domain/assistants/Assistant.ts) |
| assistants/[ProtocolClerk](src/domain/assistants/ProtocolClerk.ts) | Abstract · Extends [Assistant](src/domain/assistants/Assistant.ts) |
| assistants/[Scribe](src/domain/assistants/Scribe.ts) | Abstract · Extends [Assistant](src/domain/assistants/Assistant.ts) |
| entities/[Document](src/domain/entities/Document.ts) |  |
| entities/[DocumentLink](src/domain/entities/DocumentLink.ts) |  |
| entities/[DocumentProtocol](src/domain/entities/DocumentProtocol.ts) |  |
| entities/[Dossier](src/domain/entities/Dossier.ts) |  |
| entities/[Plea](src/domain/entities/Plea.ts) |  |
| entities/[Remark](src/domain/entities/Remark.ts) |  |
| errors/[MalformedDocumentError](src/domain/errors/MalformedDocumentError.ts) | Extends `Error` |
| errors/[NotFoundError](src/domain/errors/NotFoundError.ts) |  |
| errors/[UnexpectedValueError](src/domain/errors/UnexpectedValueError.ts) | Extends `Error` |
| tools/[Archive](src/domain/tools/Archive.ts) | Abstract |
| tools/parser/[DocumentParser](src/domain/tools/parser/DocumentParser.ts) |  |
| tools/parser/[DocumentTocLineParser](src/domain/tools/parser/DocumentTocLineParser.ts) |  |
| tools/parser/[DocumentTocParser](src/domain/tools/parser/DocumentTocParser.ts) |  |
| tools/parser/[TextExtractor](src/domain/tools/parser/TextExtractor.ts) |  |
| tools/render/[DocumentTocRender](src/domain/tools/render/DocumentTocRender.ts) |  |

### infrastructure

| Entity | Notes |
|--------|-------|
| archive/[FileSystemArchive](src/infrastructure/archive/FileSystemArchive.ts) | Extends [Archive](src/domain/tools/Archive.ts) |
| assistants/[FileSystemArchiveKeeper](src/infrastructure/assistants/FileSystemArchiveKeeper.ts) | Extends [ArchiveKeeper](src/domain/assistants/ArchiveKeeper.ts) |
| assistants/[NanoPleaFormalist](src/infrastructure/assistants/NanoPleaFormalist.ts) | Extends [PleaFormalist](src/domain/assistants/PleaFormalist.ts) |
| assistants/[NunjucksScribe](src/infrastructure/assistants/NunjucksScribe.ts) | Extends [Scribe](src/domain/assistants/Scribe.ts) |
| assistants/[YamlProtocolClerk](src/infrastructure/assistants/YamlProtocolClerk.ts) | Extends [ProtocolClerk](src/domain/assistants/ProtocolClerk.ts) |
<!-- poe:class-table:end -->
