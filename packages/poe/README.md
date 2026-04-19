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
      +boolean isEmpty
      +Record layers
      +getExternalSource()
      +getLayer()
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
      -validate()
      -validateLayer()
    }
    class InspectorPoe {
      -string basePath
      -ConfigLoader configLoader
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
    class DomainRenderer {
      +render()
    }
    class RendererRegistry {
      -Renderer domain
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
  }

  ClassRegistry *-- InspectedClass
  InspectedClass *-- InspectedClassMember
  InspectedClass *-- InspectedClassRelation
  ClassParser *-- ScannedFile
  ClassParser --> InspectedClass
  ClassRegistryParser --> ClassRegistry
  ClassRegistryParser --> ClassParser
  ClassRegistryParser --> RelationBuilder
  ClassRegistryParser --> ScannedFile
  RelationBuilder *-- ClassRegistry
  RelationBuilder --> InspectedClass
  RelationBuilder --> InspectedClassRelation
  InspectorPoe *-- ConfigLoader
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
  DomainRenderer --> ClassRegistry
  DomainRenderer --> InspectedClass
  DomainRenderer --> ClassDiagram
  DomainRenderer --> ClassTable
  RendererRegistry --> DomainRenderer
  Scanner --> ScannedFile
```

| Entity | Description |
|--------|-------------|
| ClassRegistry/[ClassRegistry](src/ClassRegistry/ClassRegistry.ts) | Collection of inspected classes |
| ClassRegistry/[InspectedClass](src/ClassRegistry/InspectedClass.ts) | Represents a single class discovered during inspection |
| ClassRegistry/[InspectedClassMember](src/ClassRegistry/InspectedClassMember.ts) | Represents a single field, getter, or method of an inspected class |
| ClassRegistry/[InspectedClassRelation](src/ClassRegistry/InspectedClassRelation.ts) | Represents a directed relation between two classes in a diagram |
| ClassRegistryParser/[ClassParser](src/ClassRegistryParser/ClassParser.ts) | Parses a single scanned file and extracts class definitions and imports |
| ClassRegistryParser/[ClassRegistryParser](src/ClassRegistryParser/ClassRegistryParser.ts) | Parses a collection of scanned files into a ClassRegistry |
| ClassRegistryParser/[RelationBuilder](src/ClassRegistryParser/RelationBuilder.ts) | Builds relations between inspected classes |
| Config/[ConfigLoader](src/Config/ConfigLoader.ts) | Resolves and loads the Poe configuration for a target package |
| [InspectorPoe](src/InspectorPoe.ts) | Inspector Poe himself. Coordinates the inspection process |
| ReadmeWriter/[ClassDiagram](src/ReadmeWriter/ClassDiagram.ts) | Generates a Mermaid class diagram for a single layer |
| ReadmeWriter/[ClassTable](src/ReadmeWriter/ClassTable.ts) | Renders a markdown table of inspected classes |
| ReadmeWriter/[PackageReport](src/ReadmeWriter/PackageReport.ts) | Renders the full package report by dispatching each configured<br>layer to its matching renderer |
| ReadmeWriter/[ReadmeWriter](src/ReadmeWriter/ReadmeWriter.ts) | Updates README files with generated class tables |
| Renderers/[DomainRenderer](src/Renderers/DomainRenderer.ts) | Renders a layer as a Mermaid class diagram plus a table of its classes<br><br>Implements `Renderer` |
| Renderers/[RendererRegistry](src/Renderers/RendererRegistry.ts) | Resolves a renderer by kind. Kinds without a dedicated renderer<br>fall back to the domain renderer until their step lands. |
| Scanner/[ScannedFile](src/Scanner/ScannedFile.ts) | Holds the raw content of a scanned source file |
| Scanner/[Scanner](src/Scanner/Scanner.ts) | Searches the project for classes worthy of inspection |
<!-- poe:classes:end -->
