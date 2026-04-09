# @dod/poe

<!-- poe:classes:start -->
## Classes

### ClassRegistryParser

```mermaid
classDiagram
  namespace class_registry_parser {
    class ClassParser {
      -ScannedFile file
      +classes()
      +imports()
    }
    class ClassRegistry {
      -Map classMap
      +InspectedClass items
      +Map externalSources
      +boolean isEmpty
      +Record layers
      +getExternalSource()
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
  }
  namespace scanner {
    class ScannedFile {
      +string path
      +string content
      +contains()
    }
  }
  namespace inspected_class {
    class InspectedClass {
      +string link
      +isEqual()
      +toString()
    }
    class InspectedClassRelation {
      +string from
      +string to
      +string arrow
      +toString()
    }
  }

  ClassParser *-- ScannedFile
  ClassParser --> InspectedClass
  ClassRegistry *-- InspectedClass
  ClassRegistryParser --> ClassParser
  ClassRegistryParser --> ClassRegistry
  ClassRegistryParser --> RelationBuilder
  ClassRegistryParser --> ScannedFile
  RelationBuilder *-- ClassRegistry
  RelationBuilder --> InspectedClass
  RelationBuilder --> InspectedClassRelation
```

| Entity | Description |
|--------|-------------|
| [ClassParser](src/ClassRegistryParser/ClassParser.ts) | Parses a single scanned file and extracts class definitions and imports |
| [ClassRegistry](src/ClassRegistryParser/ClassRegistry.ts) | Collection of inspected classes |
| [ClassRegistryParser](src/ClassRegistryParser/ClassRegistryParser.ts) | Parses a collection of scanned files into a ClassRegistry |
| [RelationBuilder](src/ClassRegistryParser/RelationBuilder.ts) | Builds relations between inspected classes and enriches them with the results |

### InspectedClass

```mermaid
classDiagram
  namespace inspected_class {
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
  }

  InspectedClass *-- InspectedClassMember
  InspectedClass *-- InspectedClassRelation
```

| Entity | Description |
|--------|-------------|
| [InspectedClass](src/InspectedClass/InspectedClass.ts) | Represents a single class discovered during inspection |
| [InspectedClassMember](src/InspectedClass/InspectedClassMember.ts) |  |
| [InspectedClassRelation](src/InspectedClass/InspectedClassRelation.ts) |  |

### PackageReport

```mermaid
classDiagram
  namespace package_report {
    class ClassDiagram {
      -ClassRegistry classRegistry
      -Set knownNames
      -string lines
      +render()
      +renderLayer()
      -renderDiagram()
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
    class LayerReport {
      -string layer
      -InspectedClass classes
      -ClassRegistry classRegistry
      -boolean hasDescriptions
      -boolean hasNotes
      +render()
      +renderContent()
      -buildHeader()
      -buildRow()
      -renderRow()
      -entityCell()
      -renderNotes()
    }
    class PackageReport {
      -ClassRegistry classRegistry
      -ClassDiagram diagram
      +render()
    }
  }
  namespace class_registry_parser {
    class ClassRegistry {
      -Map classMap
      +InspectedClass items
      +Map externalSources
      +boolean isEmpty
      +Record layers
      +getExternalSource()
    }
  }
  namespace inspected_class {
    class InspectedClass {
      +string link
      +isEqual()
      +toString()
    }
  }

  ClassDiagram *-- ClassRegistry
  ClassDiagram --> InspectedClass
  LayerReport *-- InspectedClass
  LayerReport *-- ClassRegistry
  PackageReport *-- ClassRegistry
  PackageReport *-- ClassDiagram
  PackageReport --> LayerReport
```

| Entity | Description |
|--------|-------------|
| [ClassDiagram](src/PackageReport/ClassDiagram.ts) | Generates a Mermaid class diagram from inspected classes |
| [LayerReport](src/PackageReport/LayerReport.ts) | Describes classes belonging to a specific layer |
| [PackageReport](src/PackageReport/PackageReport.ts) | Combined report grouping class tables and diagrams by layer |

### Scanner

```mermaid
classDiagram
  namespace scanner {
    class ScannedFile {
      +string path
      +string content
      +contains()
    }
    class Scanner {
      -string basePath
      +scan()
      -scanDir()
      -readItems()
      -scanItem()
      -scanFile()
      -isTsFile()
    }
  }

  Scanner --> ScannedFile
```

| Entity | Description |
|--------|-------------|
| [ScannedFile](src/Scanner/ScannedFile.ts) |  |
| [Scanner](src/Scanner/Scanner.ts) | Searches the project for classes worthy of inspection |

### root

```mermaid
classDiagram
  namespace root {
    class InspectorPoe {
      -string basePath
      +inspect()
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
  }
  namespace class_registry_parser {
    class ClassRegistry {
      -Map classMap
      +InspectedClass items
      +Map externalSources
      +boolean isEmpty
      +Record layers
      +getExternalSource()
    }
    class ClassRegistryParser {
      +parse()
      -mergeImports()
    }
  }
  namespace package_report {
    class PackageReport {
      -ClassRegistry classRegistry
      -ClassDiagram diagram
      +render()
    }
  }
  namespace scanner {
    class Scanner {
      -string basePath
      +scan()
      -scanDir()
      -readItems()
      -scanItem()
      -scanFile()
      -isTsFile()
    }
  }

  InspectorPoe --> ClassRegistry
  InspectorPoe --> ClassRegistryParser
  InspectorPoe --> PackageReport
  InspectorPoe --> ReadmeWriter
  InspectorPoe --> Scanner
```

| Entity | Description |
|--------|-------------|
| [InspectorPoe](src/InspectorPoe.ts) | Inspector Poe himself. Coordinates the inspection process |
| [ReadmeWriter](src/ReadmeWriter.ts) | Updates README files with generated class tables |
<!-- poe:classes:end -->
