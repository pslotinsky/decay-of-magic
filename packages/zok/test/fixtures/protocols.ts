import { DocumentProtocol, FieldType } from '@zok/domain/entities';

export const roadmap = DocumentProtocol.init({
  id: 'roadmap',
  prefix: 'Roadmap',
  idDigits: 2,
  path: './roadmaps',
  template: 'roadmap.nj',
  aliases: ['roadmaps'],
  fields: {
    status: {
      name: 'Status',
      type: FieldType.Enum,
      values: ['In progress', 'Done', 'Cancelled'],
    },
    created: {
      name: 'Created',
      type: FieldType.Date,
    },
  },
});

export const milestone = DocumentProtocol.init({
  id: 'milestone',
  prefix: 'Milestone',
  idDigits: 3,
  path: './milestones',
  template: 'milestone.nj',
  aliases: ['milestones'],
  fields: {
    status: {
      name: 'Status',
      type: FieldType.Enum,
      values: ['In progress', 'Done', 'Cancelled', 'Planned'],
    },
    parent: {
      name: 'Roadmap',
      type: FieldType.Link,
      protocol: 'roadmap',
    },
    created: {
      name: 'Created',
      type: FieldType.Date,
    },
  },
});

export const task = DocumentProtocol.init({
  id: 'task',
  prefix: 'DOD',
  idDigits: 4,
  path: './tasks',
  template: 'task.nj',
  aliases: ['tasks'],
  fields: {
    status: {
      name: 'Status',
      type: FieldType.Enum,
      values: ['In progress', 'Done', 'Cancelled'],
    },
    parent: {
      name: 'Milestone',
      type: FieldType.Link,
      protocol: 'milestone',
    },
    created: {
      name: 'Created',
      type: FieldType.Date,
    },
  },
});
