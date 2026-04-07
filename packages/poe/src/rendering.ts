import type { ClassDescriptor } from './parsing';

type ClassMap = Map<string, string>;

export function renderClassTable(descriptors: ClassDescriptor[]): string {
  if (descriptors.length === 0) {
    return 'No classes found.';
  }

  const classMap = buildClassMap(descriptors);
  const { root = [], ...layers } = groupByLayer(descriptors);

  return Object.entries({ ...layers, root })
    .filter(([, classes]) => classes.length > 0)
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
  const hasDescriptions = classes.some((cls) => cls.description);
  const hasNotes = classes.some((cls) => renderNotes(cls, classMap));

  const header = buildHeader(hasDescriptions, hasNotes);
  const rows = [
    header,
    header.replace(/[^|]/g, '-'),
    ...classes.map((cls) =>
      renderRow(cls, classMap, hasDescriptions, hasNotes),
    ),
  ];

  return `### ${layer}\n\n${rows.join('\n')}`;
}

function buildHeader(hasDescriptions: boolean, hasNotes: boolean): string {
  const cols = ['Entity'];

  if (hasDescriptions) {
    cols.push('Description');
  }

  if (hasNotes) {
    cols.push('Notes');
  }

  return `| ${cols.join(' | ')} |`;
}

function renderRow(
  cls: ClassDescriptor,
  classMap: ClassMap,
  hasDescriptions: boolean,
  hasNotes: boolean,
): string {
  const prefix = getSubdirPrefix(cls.file);
  const entity = `${prefix}[${cls.name}](${cls.file})`;
  const cols = [entity];

  if (hasDescriptions) {
    cols.push(cls.description ?? '');
  }

  if (hasNotes) {
    cols.push(renderNotes(cls, classMap));
  }

  return `| ${cols.join(' | ')} |`;
}

function getSubdirPrefix(file: string): string {
  const parts = file.replace(/\\/g, '/').split('/');
  const subdir = parts.slice(2, -1).join('/');

  return subdir ? `${subdir}/` : '';
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
      : `\`${cls.parent}\``;
    parts.push(`Extends ${parentRef}`);
  }

  if (cls.interfaces?.length) {
    const interfaces = cls.interfaces
      .map((name) => {
        const file = classMap.get(name);
        return file ? `[${name}](${file})` : `\`${name}\``;
      })
      .join(', ');
    parts.push(`Implements ${interfaces}`);
  }

  return parts.join(' · ');
}
