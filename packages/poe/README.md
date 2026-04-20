# @dod/poe

<!-- poe:classes:start -->
## Classes

### Classes

```mermaid
classDiagram
  namespace classes {
    class ClassRegistry {
      -Map classMap
      +InspectedClass items
      +Map externalSources
      +Endpoint endpoints
      +PrismaSchema schema
      +boolean isEmpty
      +Record layers
      +getExternalSource()
      +getLayer()
      +getLayerEndpoints()
    }
    class InspectedClass {
      +string link
      +isEqual()
      +toString()
    }
    class InspectedClassMember {
      +string name
      +Visibility visibility
      +boolean isMethod
      +string type
      +string prefix
      +toString()
    }
    class InspectedClassRelation {
      +string from
      +string to
      +string arrow
      +toString()
    }
    class ClassParser {
      -ScannedFile file
      +classes()
      +imports()
    }
    class ClassRegistryParser {
      +parse()
      -mergeImports()
      -extractEndpoints()
    }
    class RelationBuilder {
      -ClassRegistry registry
      -Set knownNames
      +buildRelations()
      -toRelations()
      -hasUsageRelation()
      -isKnownRelation()
    }
    class ConfigLoader {
      +load()
      -assertExists()
    }
    class Endpoint {
      +string file
      +string layer
      +string className
      +string method
      +string path
      +string handler
      +string params
      +string returns
      +string description
    }
    class EndpointExtractor {
      +extract()
      -findControllers()
      -extractFromController()
      -findMethodSignature()
      -stripParams()
      -stripParamAnnotations()
      -extractReturnType()
      -unwrapPromise()
      -findPrecedingJsdoc()
      -parseJsdoc()
      -joinPath()
      -findMatchingParen()
      -extractBracedBlock()
      -splitTopLevel()
    }
    class InspectorPoe {
      -string basePath
      -ConfigLoader configLoader
      -SchemaReader schemaReader
      +inspect()
    }
    class ClassDiagram {
      -ClassRegistry classRegistry
      -Set knownNames
      -string lines
      +renderLayer()
      -addLayerDiagram()
      -collectForeignClasses()
      -collectExternalParents()
      -addNamespace()
      -addExternalNamespace()
      -getRelatedNames()
      -groupByLayer()
      -addRelations()
      -isKnownName()
      -clearLines()
      -addLine()
    }
    class ClassTable {
      -string root
      -InspectedClass classes
      -ClassRegistry classRegistry
      -boolean hasDescriptionColumn
      +renderContent()
      -buildHeader()
      -buildRow()
      -renderRow()
      -entityCell()
      -descriptionCell()
      -renderNotes()
    }
    class PackageReport {
      -PoeConfig config
      -ClassRegistry classRegistry
      -RendererRegistry renderers
      +render()
      -renderLayer()
    }
    class ReadmeWriter {
      -string basePath
      -string readmePath
      +write()
      -save()
      -load()
      -updateContent()
      -readPackageName()
    }
    class ApiRenderer {
      +render()
      -groupByController()
      -renderController()
      -row()
      -descriptionCell()
      -escape()
      -controllerTitle()
    }
    class ApplicationRenderer {
      +render()
      -groupByEntity()
      -entityName()
      -renderEntitySection()
      -renderEntryPointsSection()
      -isVisible()
      -useCaseRow()
      -descriptionCell()
      -signatureLines()
      -escape()
      -params()
      -returnType()
      -splitTopLevel()
    }
    class DomainRenderer {
      +render()
    }
    class InfrastructureRenderer {
      +render()
      -renderDiagram()
      -renderModelBlock()
      -renderField()
      -renderRelation()
      -relationConnector()
    }
    class RendererRegistry {
      -Renderer domain
      -Renderer application
      -Renderer api
      -Renderer infrastructure
      +resolve()
    }
    class ScannedFile {
      +string path
      +string content
      +string layer
      +contains()
    }
    class Scanner {
      -string basePath
      -LayerConfig layers
      +scan()
      -scanLayer()
      -scanDir()
      -readItems()
      -scanItem()
      -scanFile()
      -isTsFile()
    }
    class PrismaModel {
      +string name
      +string tableName
      +PrismaField fields
      +PrismaRelation relations
    }
    class PrismaSchema {
      +PrismaModel models
      +boolean isEmpty
    }
    class SchemaParser {
      +parse()
    }
    class SchemaReader {
      +read()
    }
  }

  ClassRegistry *-- InspectedClass
  ClassRegistry *-- Endpoint
  ClassRegistry *-- PrismaSchema
  InspectedClass *-- InspectedClassMember
  InspectedClass *-- InspectedClassRelation
  ClassParser *-- ScannedFile
  ClassParser --> InspectedClass
  ClassRegistryParser --> ClassRegistry
  ClassRegistryParser --> ClassParser
  ClassRegistryParser --> RelationBuilder
  ClassRegistryParser --> Endpoint
  ClassRegistryParser --> EndpointExtractor
  ClassRegistryParser --> ScannedFile
  ClassRegistryParser --> PrismaSchema
  RelationBuilder *-- ClassRegistry
  RelationBuilder --> InspectedClass
  RelationBuilder --> InspectedClassRelation
  EndpointExtractor --> Endpoint
  EndpointExtractor --> ScannedFile
  InspectorPoe *-- ConfigLoader
  InspectorPoe *-- SchemaReader
  InspectorPoe --> ClassRegistry
  InspectorPoe --> ClassRegistryParser
  InspectorPoe --> PackageReport
  InspectorPoe --> ReadmeWriter
  InspectorPoe --> Scanner
  ClassDiagram *-- ClassRegistry
  ClassDiagram --> InspectedClass
  ClassTable *-- InspectedClass
  ClassTable *-- ClassRegistry
  PackageReport *-- ClassRegistry
  PackageReport *-- RendererRegistry
  ApiRenderer --> ClassRegistry
  ApiRenderer --> InspectedClass
  ApiRenderer --> Endpoint
  ApplicationRenderer --> InspectedClass
  DomainRenderer --> ClassRegistry
  DomainRenderer --> InspectedClass
  DomainRenderer --> ClassDiagram
  DomainRenderer --> ClassTable
  InfrastructureRenderer --> ClassRegistry
  InfrastructureRenderer --> InspectedClass
  InfrastructureRenderer --> PrismaModel
  InfrastructureRenderer --> PrismaSchema
  RendererRegistry --> ApiRenderer
  RendererRegistry --> ApplicationRenderer
  RendererRegistry --> DomainRenderer
  RendererRegistry --> InfrastructureRenderer
  Scanner --> ScannedFile
  PrismaSchema *-- PrismaModel
  SchemaParser --> PrismaModel
  SchemaParser --> PrismaSchema
  SchemaReader --> PrismaSchema
  SchemaReader --> SchemaParser
```

| Entity | Description |
|--------|-------------|
| ClassRegistry/[ClassRegistry](src/ClassRegistry/ClassRegistry.ts) | Collection of inspected classes plus any extracted endpoints and schema |
| ClassRegistry/[InspectedClass](src/ClassRegistry/InspectedClass.ts) | Represents a single class discovered during inspection |
| ClassRegistry/[InspectedClassMember](src/ClassRegistry/InspectedClassMember.ts) | Represents a single field, getter, or method of an inspected class |
| ClassRegistry/[InspectedClassRelation](src/ClassRegistry/InspectedClassRelation.ts) | Represents a directed relation between two classes in a diagram |
| ClassRegistryParser/[ClassParser](src/ClassRegistryParser/ClassParser.ts) | Parses a single scanned file and extracts class definitions and imports |
| ClassRegistryParser/[ClassRegistryParser](src/ClassRegistryParser/ClassRegistryParser.ts) | Parses a collection of scanned files into a ClassRegistry |
| ClassRegistryParser/[RelationBuilder](src/ClassRegistryParser/RelationBuilder.ts) | Builds relations between inspected classes |
| Config/[ConfigLoader](src/Config/ConfigLoader.ts) | Resolves and loads the Poe configuration for a target package |
| Endpoints/[Endpoint](src/Endpoints/Endpoint.ts) | A single HTTP endpoint exposed by a controller |
| Endpoints/[EndpointExtractor](src/Endpoints/EndpointExtractor.ts) | Parses controller source files and extracts HTTP endpoints |
| [InspectorPoe](src/InspectorPoe.ts) | Inspector Poe himself. Coordinates the inspection process |
| ReadmeWriter/[ClassDiagram](src/ReadmeWriter/ClassDiagram.ts) | Generates a Mermaid class diagram for a single layer |
| ReadmeWriter/[ClassTable](src/ReadmeWriter/ClassTable.ts) | Renders a markdown table of inspected classes |
| ReadmeWriter/[PackageReport](src/ReadmeWriter/PackageReport.ts) | Renders the full package report by dispatching each configured<br>layer to its matching renderer |
| ReadmeWriter/[ReadmeWriter](src/ReadmeWriter/ReadmeWriter.ts) | Updates README files with generated class tables |
| Renderers/[ApiRenderer](src/Renderers/ApiRenderer.ts) | Renders a layer as per-controller endpoint tables<br><br>Implements `Renderer` |
| Renderers/[ApplicationRenderer](src/Renderers/ApplicationRenderer.ts) | Renders a layer as a use-case table. Entry points (facades without a<br>parent base) get a separate section. Handlers and abstract bases are<br>hidden as implementation detail.<br><br>Implements `Renderer` |
| Renderers/[DomainRenderer](src/Renderers/DomainRenderer.ts) | Renders a layer as a Mermaid class diagram plus a table of its classes<br><br>Implements `Renderer` |
| Renderers/[InfrastructureRenderer](src/Renderers/InfrastructureRenderer.ts) | Renders a layer as an ER diagram derived from the Prisma schema<br><br>Implements `Renderer` |
| Renderers/[RendererRegistry](src/Renderers/RendererRegistry.ts) | Resolves a renderer by kind |
| Scanner/[ScannedFile](src/Scanner/ScannedFile.ts) | Holds the raw content of a scanned source file |
| Scanner/[Scanner](src/Scanner/Scanner.ts) | Searches the project for classes worthy of inspection |
| Schema/[PrismaModel](src/Schema/PrismaSchema.ts) |  |
| Schema/[PrismaSchema](src/Schema/PrismaSchema.ts) |  |
| Schema/[SchemaParser](src/Schema/SchemaParser.ts) | Parses a Prisma schema file into a PrismaSchema |
| Schema/[SchemaReader](src/Schema/SchemaReader.ts) | Reads and parses the Prisma schema for a package, if present |
<!-- poe:classes:end -->
