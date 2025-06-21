# Design-001: The inner world of Zok

| Field   | Value      |
| ------- | ---------- |
| Status  | Draft      |
| Created | 2025-06-21 |

## Сущности

### API layer (Zok office)

- Zok — главный управляющий
- Request — Зок не принимает команд, только просьбы
- Remark — реплика Зока (ответ пользователю)

### Application layer (Zok's assistants)

- DutyInstruction — должностная инструкция Зока (по сути юз-кейс)
- Assistant — Базовый класс для всех помощников Зока
- Interpreter — Расшифровывает Зоку, что от него хотят эти неразумные существа
- Scribe — создание документов / шаблонизация
- Linker — управление ссылками и связями
- ProtocolClerk — загрузка и проверка конфигурации
- HumorAdvisor — подсказывает ремарки Зоку
- DocumentSeeker — Ищет документы в архиве. Сам Зок в хранилище архива никогда не ходит

### Domain layer (Precious archive information)

- Document — конкретный файл с содержимым и метаданными
- DocumentProtocol — описание типа документа (task, idea, ...)
- FieldDefinition — описание отдельного поля документа
- FieldType — тип поля: string, date, enum, link, ...
- Profile — досье на сотрудника архива

### Infrastructure layer (Buildings, equipment, etc.)

- Archive — хранилище файлов

### Диаграмма классов

```mermaid
classDiagram
  class Zok
  class Request
  class Remark
  class Profile
  class Interpreter
  class Assistant
  class Scribe
  class Linker
  class ProtocolClerk
  class HumorAdvisor
  class DocumentSeeker
  class Document
  class DocumentProtocol
  class FieldDefinition
  class Archive
  Zok *-- Profile
  Zok --> Request
  Zok --> Remark
  Zok --> Assistant
  Assistant *-- Profile
  Assistant --> Archive
  Assistant --> Document
  Interpreter --|> Assistant
  Scribe --|> Assistant
  Linker --|> Assistant
  ProtocolClerk --|> Assistant
  HumorAdvisor --|> Assistant
  DocumentSeeker --|> Assistant
  Interpreter --> Request
  ProtocolClerk --> DocumentProtocol
  HumorAdvisor --> Remark
  DocumentProtocol *-- FieldDefinition
  Document *-- DocumentProtocol
  Archive o-- Document
```

## Должностные инструкции

Любое выполнение должностной инструкции начинается с того, что Зок получает какую-то просьбу от пользователя и просит интерпретатора объяснить нормально, чего от него хотят. Поняв это, Зок просит протоколиста проверить, что для запрашиваемого типа документов сущетсвует протокол. Если протокол существует, то Зок приступает к должностным инструкциям. Иначе Зок раздраженно просит советника по юмору составить ему язвительный ответ и передает его пользователю. Иначе Зок выполняет свою должностную инструкцию, и возвращает пользователю ремарку о проделанной работе

```mermaid
sequenceDiagram
  actor User
  User->>Zok: Asks Zok for something
  Zok->>Interpreter: What does he want from me?
  Interpreter->>Zok: Request
  Zok->>ProtocolClerk: What protocol is required for this type of document?
  alt is unknown
    ProtocolClerk->>Zok: I don't know
    Zok->>HumorAdvisor: So what should I tell him?
    HumorAdvisor->>Zok: Remark
    Zok->>User: Remark
  else is known
    ProtocolClerk->>Zok: Protocol
    Zok->>Zok: Execute duty instruction
    Zok->>User: Remark
  end
```

### Должностная инструкция по созданию документа

- Зоку передает запрос пользователя и протокол документа Писателю
- Писатель создает документ и возвращает его Зоку
- Зок просит Линкера узнать, есть ли связи с другими документами и перелинковать их, а так же обновить таблицы с содержанием
- Зок просит Советника по шуткам придумать остроумную ремарку
- Зок передает ремарку пользователю

```mermaid
sequenceDiagram
  Zok->>Scribe: Request + DocumentProtocol
  Scribe->>Zok: Document
  Zok->>Linker: Document
  Linker->>Linker: Update links and tables of content
  Linker->>Zok: Done
  Zok->>HumorAdvisor: Request + Document
  HumorAdvisor->>Zok: Remark
```

### Должностная инструкция по изменению статуса документа

- Зок просит искателя докуметов найти документ
- Если документ не найден, то просит советника по юмору составить язвительны ответ
- Если найден, то Зок просит протоколиста узнать поддерживает ли протокол статус
- Если нет, то просит советника по юмору составить язвительны ответ
- Если да, то Зок просит писаря исправить стутус документа
- Зок просит линкера обновить таблицы с содержимым
- Зок просит советника по юмору составить ироничный отчет о работе

```mermaid
sequenceDiagram
  Zok->>DocumentSeeker: Request
  alt document is not found
    DocumentSeeker->>Zok: Document not found
    Zok->>HumorAdvisor: Request
    HumorAdvisor->>Zok: Remark
  else document is found
    DocumentSeeker->>Zok: Document
    Zok->>ProtocolClerk: Request
    alt status is not supported
      ProtocolClerk->>Zok: No
      Zok->>HumorAdvisor: Request + Document
      HumorAdvisor->>Zok: Remark
    else status is supported
      ProtocolClerk->>Zok: Yes
      Zok->>Scribe: Request + DocumentProtocol + Document
      Zok->>Linker: Document
      Linker->>Linker: Update tables of content
      Linker->>Zok: Done
      Zok->>HumorAdvisor: Request + Document
      HumorAdvisor->>Zok: Remark
    end
  end
```

### Должностная инструкция по переименованию документа

- Зок просит искателя докуметов найти документ
- Если документ не найден, то просит советника по юмору составить язвительны ответ
- Если найден, то Зок просит писаря переназвать документ
- Зок просит линкера перелинковать документы и обновить таблицы с содержимым
- Зок просит советника по юмору составить ироничный отчет о работе

```mermaid
sequenceDiagram
  Zok->>DocumentSeeker: Request
  alt document is not found
    DocumentSeeker->>Zok: Document not found
    Zok->>HumorAdvisor: Request
    HumorAdvisor->>Zok: Remark
  else document is found
    DocumentSeeker->>Zok: Document
    Zok->>Scribe: Request + DocumentProtocol + Document
    Zok->>Linker: Document
    Linker->>Linker: Update links and tables of content
    Linker->>Zok: Done
    Zok->>HumorAdvisor: Request + Document
    HumorAdvisor->>Zok: Remark
  end
```

### Должностная инструкция по поиску документов

- Зок просит искателя докуметов найти документ
- Зок просит советника по юмору составить остроумный отчет

```mermaid
sequenceDiagram
  Zok->>DocumentSeeker: Request
  DocumentSeeker->>Zok: Documents
  Zok->>HumorAdvisor: Request + Documents
  HumorAdvisor->>Zok: Remark
```

## Zok's office

![Zok's team](../assets/zok-team.jpg "Zok's team")
