# @dod/poe

<!-- poe:classes:start -->
## Classes

### root

```mermaid
classDiagram
  namespace root {
    class ClassDiagram
    class ClassParser
    class ClassRegistry
    class ClassReport
    class InspectedClass
    class InspectorPoe
    class LayerReport
    class PackageReport
    class ReadmeWriter
    class Scanner
  }

  ClassDiagram *-- ClassRegistry
  ClassDiagram --> InspectedClass
  ClassParser --> ClassRegistry
  ClassParser --> InspectedClass
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
| [ClassParser](src/ClassParser.ts) | Parses source files and extracts inspected classes |
| [ClassRegistry](src/ClassRegistry.ts) | Collection of inspected classes |
| [ClassReport](src/ClassReport.ts) | Aggregated report describing inspected classes |
| [InspectedClass](src/InspectedClass.ts) | Represents a single class discovered during inspection |
| [InspectorPoe](src/InspectorPoe.ts) | Inspector Poe himself. Coordinates the inspection process |
| [LayerReport](src/LayerReport.ts) | Describes classes belonging to a specific layer |
| [PackageReport](src/PackageReport.ts) | Combined report grouping class tables and diagrams by layer |
| [ReadmeWriter](src/ReadmeWriter.ts) | Updates README files with generated class tables |
| [Scanner](src/Scanner.ts) | Searches the project for classes worthy of inspection |
<!-- poe:classes:end -->
