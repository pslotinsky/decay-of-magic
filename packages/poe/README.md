# @dod/poe

<!-- poe:classes:start -->
## Classes

### ClassParser

```mermaid
classDiagram
  namespace class_parser {
    class ClassParser {
      -string packagePath
      +parse()
      -readContent()
      -extractClasses()
      -getLayer()
      -parseJsDoc()
      -parseInterfaces()
      -extractExternalImports()
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
  namespace root {
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
    class InspectedClassRelation {
      +string from
      +string to
      +string arrow
      +toString()
    }
  }

  ClassParser --> RelationBuilder
  ClassParser --> ClassRegistry
  ClassParser --> InspectedClass
  RelationBuilder *-- ClassRegistry
  RelationBuilder --> InspectedClass
  RelationBuilder --> InspectedClassRelation
```

| Entity | Description |
|--------|-------------|
| [ClassParser](src/ClassParser/ClassParser.ts) | Parses source files and extracts inspected classes |
| [RelationBuilder](src/ClassParser/RelationBuilder.ts) | Builds relations between inspected classes and enriches them with the results |

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

### root

```mermaid
classDiagram
  namespace root {
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
    class ClassRegistry {
      -Map classMap
      +InspectedClass items
      +Map externalSources
      +boolean isEmpty
      +Record layers
      +getExternalSource()
    }
    class ClassReport {
      -ClassRegistry classRegistry
      +render()
    }
    class InspectorPoe {
      -string basePath
      +inspect()
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
    class ReadmeWriter {
      -string basePath
      -string readmePath
      +write()
      -save()
      -load()
      -updateContent()
      -readPackageName()
    }
    class Scanner {
      -string basePath
      +scan()
      -scanDir()
      -readItems()
      -scanItem()
      -isTsFile()
    }
  }
  namespace inspected_class {
    class InspectedClass {
      +string link
      +isEqual()
      +toString()
    }
  }
  namespace class_parser {
    class ClassParser {
      -string packagePath
      +parse()
      -readContent()
      -extractClasses()
      -getLayer()
      -parseJsDoc()
      -parseInterfaces()
      -extractExternalImports()
    }
  }

  ClassDiagram *-- ClassRegistry
  ClassDiagram --> InspectedClass
  ClassRegistry *-- InspectedClass
  ClassReport *-- ClassRegistry
  ClassReport --> LayerReport
  InspectorPoe --> ClassParser
  InspectorPoe --> PackageReport
  InspectorPoe --> ReadmeWriter
  InspectorPoe --> Scanner
  LayerReport *-- InspectedClass
  LayerReport *-- ClassRegistry
  PackageReport *-- ClassRegistry
  PackageReport *-- ClassDiagram
  PackageReport --> LayerReport
```

| Entity | Description |
|--------|-------------|
| [ClassDiagram](src/ClassDiagram.ts) | Generates a Mermaid class diagram from inspected classes |
| [ClassRegistry](src/ClassRegistry.ts) | Collection of inspected classes |
| [ClassReport](src/ClassReport.ts) | Aggregated report describing inspected classes |
| [InspectorPoe](src/InspectorPoe.ts) | Inspector Poe himself. Coordinates the inspection process |
| [LayerReport](src/LayerReport.ts) | Describes classes belonging to a specific layer |
| [PackageReport](src/PackageReport.ts) | Combined report grouping class tables and diagrams by layer |
| [ReadmeWriter](src/ReadmeWriter.ts) | Updates README files with generated class tables |
| [Scanner](src/Scanner.ts) | Searches the project for classes worthy of inspection |
<!-- poe:classes:end -->
