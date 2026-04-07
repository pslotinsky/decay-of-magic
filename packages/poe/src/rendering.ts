import type { ClassDescriptor } from './parsing';

type ClassMap = Map<string, string>;

export function renderClassTable(descriptors: ClassDescriptor[]): string {
  if (descriptors.length === 0) {
    return 'No classes found.';
  }

  const classMap = buildClassMap(descriptors);
  const byLayer = groupByLayer(descriptors);

  return Object.entries(byLayer)
    .map(([layer, classes]) => renderLayer(layer, classes, classMap))
    .join('\n\n');
}

function buildClassMap(descriptors: ClassDescriptor[]): ClassMap {
  return new Map(
    descriptors.map((descriptor) => [descriptor.name, descriptor.file]),
  );
}

function groupByLayer(
  descriptors: ClassDescriptor[],
): Record<string, ClassDescriptor[]> {
  const result: Record<string, ClassDescriptor[]> = {};

  for (const descriptor of descriptors) {
    (result[descriptor.layer] ??= []).push(descriptor);
  }

  return result;
}

function renderLayer(
  layer: string,
  classes: ClassDescriptor[],
  classMap: ClassMap,
): string {
  const rows = [
    '| Entity | Description | Notes |',
    '| ------ | ----------- | ----- |',
    ...classes.map((cls) => renderRow(cls, classMap)),
  ];

  return `### ${layer}\n\n${rows.join('\n')}`;
}

function renderRow(cls: ClassDescriptor, classMap: ClassMap): string {
  const entity = `[${cls.name}](${cls.file})`;
  const description = cls.description ?? '';
  const notes = renderNotes(cls, classMap);

  return `| ${entity} | ${description} | ${notes} |`;
}

function renderNotes(cls: ClassDescriptor, classMap: ClassMap): string {
  const parts: string[] = [];

  if (cls.abstract) {
    parts.push('Abstract');
  }

  if (cls.parent) {
    const parentFile = classMap.get(cls.parent);
    const parentRef = parentFile
      ? `[${cls.parent}](${parentFile})`
      : cls.parent;
    parts.push(`Extends ${parentRef}`);
  }

  if (cls.interfaces?.length) {
    parts.push(`Implements ${cls.interfaces.join(', ')}`);
  }

  return parts.join(' · ');
}
