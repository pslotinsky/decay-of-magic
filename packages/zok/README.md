# zok

<!-- poe:classes:start -->
## Classes

### Application

#### Entry points

- [Zok](src/application/Zok.ts)

#### Document

| Use case | Description |
|----------|-------------|
| [ChangeStatusDutyInstruction](src/application/instructions/ChangeStatusDutyInstruction.ts) | Returns: `Document` |
| [CreateDocumentDutyInstruction](src/application/instructions/CreateDocumentDutyInstruction.ts) | Returns: `Document` |
| [DeleteDocumentDutyInstruction](src/application/instructions/DeleteDocumentDutyInstruction.ts) | Returns: `Document` |
| [ListDocumentsDutyInstruction](src/application/instructions/ListDocumentsDutyInstruction.ts) | Returns: `Document[]` |
| [MoveDocumentDutyInstruction](src/application/instructions/MoveDocumentDutyInstruction.ts) | Returns: `Document` |
| [RenameDocumentDutyInstruction](src/application/instructions/RenameDocumentDutyInstruction.ts) | Returns: `Document` |
| [UpdateDocumentRelationsDutyInstruction](src/application/instructions/UpdateDocumentRelationsDutyInstruction.ts) | Returns: `Document \| undefined` |

#### Other

| Use case | Description |
|----------|-------------|
| [UpdateReadmeDutyInstruction](src/application/instructions/UpdateReadmeDutyInstruction.ts) |  |

### Domain

```mermaid
classDiagram
  namespace domain {
    class ArchiveKeeper {
      #Archive archive
      +issueDocumentNumber()
      +find()
      +findById()
      +findByIdOrFail()
      +save()
      +delete()
      +replace()
      #getSerialNumber()
      #formatDocumentNumber()
      #createArchive()
    }
    class Assistant {
      #report()
      +init()
    }
    class HumorAdvisor {
      +remarkOnDocumentDeletion()
      +remarkOnDocumentCreation()
      +remarkOnDocumentRelationsUpdate()
      +remarkOnDocumentList()
      +remarkOnDocumentRename()
      +remarkOnDocumentMove()
      +remarkOnDocumentStatusChange()
      +remarkOnReadmeUpdate()
      +remarkOnError()
      +makeDummyRemark()
      -pickJoke()
    }
    class PleaFormalist {
      +formalizePlea()
      #issueId()
    }
    class ProtocolClerk {
      #Map protocols
      +getProtocol()
      +hasProtocol()
      +getChildProtocols()
      #findByAlias()
    }
    class Scribe {
      +createDocument()
      #fillDocumentFields()
      #getDefaultFieldValues()
      +renderRecord()
      #fillDocumentContent()
    }
    class Document {
      +DocumentMetadata metadata
      +string content
      +string id
      +string title
      +DocumentProtocol protocol
      +string fileName
      +string relativePath
      +getField()
      +setField()
      +followsProtocol()
    }
    class DocumentLink {
      +string id
      +string text
      +string path
      +toString()
    }
    class DocumentProtocol {
      +string id
      +string prefix
      +number idDigits
      +string path
      +string template
      +string aliases
      +Record fields
      +string parentProtocolId
      +getField()
      +findFieldKeyByName()
      +normalizeFieldValue()
      #normalizeDocumentDateField()
      #normalizeDocumentEnumField()
    }
    class Dossier {
      +string name
      +number age
      +string race
      +string gender
      +string bio
    }
    class Plea {
      +string id
      #PleaForm form
      #PleaReport reports
      +PleaType type
      +string protocol
      +Date creationTime
      +getValue()
      +setValue()
      +addReport()
    }
    class Remark {
      +string text
      +TResult result
      +toString()
    }
    class MalformedDocumentError
    class NotFoundError {
      +string entity
      +C criteria
    }
    class UnexpectedValueError {
      +unknown value
    }
    class Archive {
      #DocumentParser documentParser
      +count()
      +find()
      +save()
      +delete()
      +replace()
    }
    class DocumentParser {
      +parse()
      -parseMetadata()
      -parseIdAndTitle()
      -parseFields()
      -parseToc()
      -parseField()
      -parseDateField()
      -splitOnSections()
      -fetchTitleSection()
      -fetchFieldsSection()
    }
    class DocumentTocLineParser {
      -string line
      -DocumentStatus status
      -string label
      -string link
      +parse()
      -extractStatus()
      -extractLabel()
      -extractLink()
    }
    class DocumentTocParser {
      -string content
      +parse()
      -parseTocProtocolName()
    }
    class TextExtractor {
      -string text
      -boolean isSameTokens
      -Token startToken
      -Token endToken
      -string remainingText
      -boolean isFinalTokenFound
      -string extractedText
      +execute()
      -isTokenMatched()
      -updateStartToken()
      -updateEndToken()
      -updateRemainingText()
      -initToken()
    }
    class DocumentTocRender {
      -DocumentToc toc
      +render()
      -renderLine()
    }
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

| Entity | Description |
|--------|-------------|
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
<!-- poe:classes:end -->
