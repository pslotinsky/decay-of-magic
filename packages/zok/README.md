# zok

<!-- poe:classes:start -->
## Classes

### application

```mermaid
classDiagram
  namespace application {
    class Zok
    class ChangeStatusDutyInstruction
    class CreateDocumentDutyInstruction
    class DeleteDocumentDutyInstruction
    class DutyInstruction
    class ListDocumentsDutyInstruction
    class MoveDocumentDutyInstruction
    class RenameDocumentDutyInstruction
    class UpdateDocumentRelationsDutyInstruction
    class UpdateReadmeDutyInstruction
  }
  namespace domain {
    class Assistant
    class HumorAdvisor
    class Document
    class Dossier
    class Plea
    class Remark
    class UnexpectedValueError
    class DocumentLink
    class DocumentProtocol
    class DocumentTocRender
  }

  Zok --> ChangeStatusDutyInstruction
  Zok --> CreateDocumentDutyInstruction
  Zok --> DeleteDocumentDutyInstruction
  Zok --> DutyInstruction
  Zok --> ListDocumentsDutyInstruction
  Zok --> MoveDocumentDutyInstruction
  Zok --> RenameDocumentDutyInstruction
  Zok --> UpdateDocumentRelationsDutyInstruction
  Zok --> UpdateReadmeDutyInstruction
  Zok --> Assistant
  Zok --> HumorAdvisor
  Zok --> Document
  Zok --> Dossier
  Zok --> Plea
  Zok --> Remark
  ChangeStatusDutyInstruction --|> DutyInstruction
  ChangeStatusDutyInstruction --> Document
  ChangeStatusDutyInstruction --> Remark
  ChangeStatusDutyInstruction --> UnexpectedValueError
  CreateDocumentDutyInstruction --|> DutyInstruction
  CreateDocumentDutyInstruction --> Document
  CreateDocumentDutyInstruction --> DocumentLink
  CreateDocumentDutyInstruction --> DocumentProtocol
  CreateDocumentDutyInstruction --> Remark
  DeleteDocumentDutyInstruction --|> DutyInstruction
  DeleteDocumentDutyInstruction --> Document
  DeleteDocumentDutyInstruction --> Remark
  DutyInstruction --> Zok
  DutyInstruction --> Assistant
  DutyInstruction --> Document
  DutyInstruction --> DocumentProtocol
  DutyInstruction --> Plea
  DutyInstruction --> Remark
  ListDocumentsDutyInstruction --|> DutyInstruction
  ListDocumentsDutyInstruction --> Document
  ListDocumentsDutyInstruction --> Remark
  MoveDocumentDutyInstruction --|> DutyInstruction
  MoveDocumentDutyInstruction --> UpdateDocumentRelationsDutyInstruction
  MoveDocumentDutyInstruction --> Document
  MoveDocumentDutyInstruction --> DocumentLink
  MoveDocumentDutyInstruction --> Remark
  MoveDocumentDutyInstruction --> UnexpectedValueError
  RenameDocumentDutyInstruction --|> DutyInstruction
  RenameDocumentDutyInstruction --> Document
  RenameDocumentDutyInstruction --> DocumentLink
  RenameDocumentDutyInstruction --> Remark
  UpdateDocumentRelationsDutyInstruction --|> DutyInstruction
  UpdateDocumentRelationsDutyInstruction --> Document
  UpdateDocumentRelationsDutyInstruction --> DocumentLink
  UpdateDocumentRelationsDutyInstruction --> DocumentProtocol
  UpdateDocumentRelationsDutyInstruction --> Remark
  UpdateDocumentRelationsDutyInstruction --> DocumentTocRender
  UpdateReadmeDutyInstruction --|> DutyInstruction
  UpdateReadmeDutyInstruction --> Document
  UpdateReadmeDutyInstruction --> DocumentProtocol
  UpdateReadmeDutyInstruction --> Remark
  UpdateReadmeDutyInstruction --> DocumentTocRender
```

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

```mermaid
classDiagram
  namespace domain {
    class ArchiveKeeper
    class Assistant
    class HumorAdvisor
    class PleaFormalist
    class ProtocolClerk
    class Scribe
    class Document
    class DocumentLink
    class DocumentProtocol
    class Dossier
    class Plea
    class Remark
    class MalformedDocumentError
    class NotFoundError
    class UnexpectedValueError
    class Archive
    class DocumentParser
    class DocumentTocLineParser
    class DocumentTocParser
    class TextExtractor
    class DocumentTocRender
  }

  ArchiveKeeper --|> Assistant
  ArchiveKeeper *-- Archive
  ArchiveKeeper --> Document
  ArchiveKeeper --> DocumentProtocol
  ArchiveKeeper --> NotFoundError
  Assistant *-- Dossier
  HumorAdvisor --|> Assistant
  HumorAdvisor --> Document
  HumorAdvisor --> Dossier
  HumorAdvisor --> Remark
  PleaFormalist --|> Assistant
  PleaFormalist --> Plea
  ProtocolClerk --|> Assistant
  ProtocolClerk --> Document
  ProtocolClerk --> DocumentProtocol
  ProtocolClerk --> NotFoundError
  Scribe --|> Assistant
  Scribe --> Document
  Scribe --> DocumentProtocol
  Scribe --> Plea
  Document --> DocumentProtocol
  DocumentLink --> Document
  DocumentProtocol --> Document
  DocumentProtocol --> UnexpectedValueError
  Plea --> Document
  Plea --> DocumentProtocol
  MalformedDocumentError --|> Error
  UnexpectedValueError --|> Error
  Archive *-- DocumentParser
  Archive --> Document
  DocumentParser --> Document
  DocumentParser --> DocumentLink
  DocumentParser --> DocumentProtocol
  DocumentParser --> MalformedDocumentError
  DocumentParser --> UnexpectedValueError
  DocumentParser --> DocumentTocParser
  DocumentTocLineParser --> Document
  DocumentTocLineParser --> MalformedDocumentError
  DocumentTocLineParser --> TextExtractor
  DocumentTocParser --> Document
  DocumentTocParser --> MalformedDocumentError
  DocumentTocParser --> DocumentTocLineParser
  DocumentTocRender --> Document
```

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

```mermaid
classDiagram
  namespace infrastructure {
    class FileSystemArchive
    class FileSystemArchiveKeeper
    class NanoPleaFormalist
    class NunjucksScribe
    class YamlProtocolClerk
  }
  namespace domain {
    class Archive
    class Document
    class DocumentProtocol
    class ArchiveKeeper
    class Dossier
    class PleaFormalist
    class Scribe
    class DocumentLink
    class Plea
    class ProtocolClerk
  }

  FileSystemArchive --|> Archive
  FileSystemArchive --> Document
  FileSystemArchive --> DocumentProtocol
  FileSystemArchiveKeeper --|> ArchiveKeeper
  FileSystemArchiveKeeper --> Dossier
  FileSystemArchiveKeeper --> Archive
  FileSystemArchiveKeeper --> FileSystemArchive
  NanoPleaFormalist --|> PleaFormalist
  NanoPleaFormalist --> Dossier
  NunjucksScribe --|> Scribe
  NunjucksScribe --> Document
  NunjucksScribe --> DocumentLink
  NunjucksScribe --> Dossier
  NunjucksScribe --> Plea
  YamlProtocolClerk --|> ProtocolClerk
  YamlProtocolClerk --> Document
  YamlProtocolClerk --> DocumentProtocol
  YamlProtocolClerk --> Dossier
  YamlProtocolClerk --> Plea
```

| Entity | Notes |
|--------|-------|
| archive/[FileSystemArchive](src/infrastructure/archive/FileSystemArchive.ts) | Extends [Archive](src/domain/tools/Archive.ts) |
| assistants/[FileSystemArchiveKeeper](src/infrastructure/assistants/FileSystemArchiveKeeper.ts) | Extends [ArchiveKeeper](src/domain/assistants/ArchiveKeeper.ts) |
| assistants/[NanoPleaFormalist](src/infrastructure/assistants/NanoPleaFormalist.ts) | Extends [PleaFormalist](src/domain/assistants/PleaFormalist.ts) |
| assistants/[NunjucksScribe](src/infrastructure/assistants/NunjucksScribe.ts) | Extends [Scribe](src/domain/assistants/Scribe.ts) |
| assistants/[YamlProtocolClerk](src/infrastructure/assistants/YamlProtocolClerk.ts) | Extends [ProtocolClerk](src/domain/assistants/ProtocolClerk.ts) |
<!-- poe:classes:end -->
