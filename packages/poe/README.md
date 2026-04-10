# @dod/poe

<!-- poe:classes:start -->
## Classes

```mermaid
classDiagram
  namespace class_registry {
    class ClassRegistry {
      -Map classMap
      +InspectedClass items
      +Map externalSources
      +boolean isEmpty
      +Record layers
      +getExternalSource()
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
  }
  namespace class_registry_parser {
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
  }
  namespace readme_writer {
    class ClassDiagram {
      -ClassRegistry classRegistry
      -Set knownNames
      -string lines
      +render()
      +renderAll()
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
    class ClassTable {
      -string layer
      -InspectedClass classes
      -ClassRegistry classRegistry
      -boolean hasDescriptions
      -boolean hasNotes
      -boolean flat
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
      -renderFlat()
      -renderByLayers()
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
  namespace root {
    class InspectorPoe {
      -string basePath
      +inspect()
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
  PackageReport *-- ClassDiagram
  PackageReport --> ClassTable
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
| ReadmeWriter/[ClassDiagram](src/ReadmeWriter/ClassDiagram.ts) | Generates a Mermaid class diagram from inspected classes |
| ReadmeWriter/[ClassTable](src/ReadmeWriter/ClassTable.ts) | Renders a markdown table of inspected classes |
| ReadmeWriter/[PackageReport](src/ReadmeWriter/PackageReport.ts) | Combined report grouping class tables and diagrams by layer |
| ReadmeWriter/[ReadmeWriter](src/ReadmeWriter/ReadmeWriter.ts) | Updates README files with generated class tables |
| Scanner/[ScannedFile](src/Scanner/ScannedFile.ts) | Holds the raw content of a scanned source file |
| Scanner/[Scanner](src/Scanner/Scanner.ts) | Searches the project for classes worthy of inspection |
| [InspectorPoe](src/InspectorPoe.ts) | Inspector Poe himself. Coordinates the inspection process |
<!-- poe:classes:end -->
