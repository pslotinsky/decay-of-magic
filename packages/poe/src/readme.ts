import { readFile, writeFile } from 'fs/promises';
import { basename, join, resolve } from 'path';

export async function updateReadme(
  path: string,
  sectionId: string,
  content: string,
): Promise<void> {
  const readmePath = resolve(path, 'README.md');

  const startTag = `<!-- poe:${sectionId}:start -->`;
  const endTag = `<!-- poe:${sectionId}:end -->`;

  let readme: string;

  try {
    readme = await readFile(readmePath, 'utf-8');
  } catch {
    const name = await readPackageName(path);
    readme = `# ${name}\n\n`;
  }

  const section = `${startTag}\n${content}\n${endTag}`;
  const start = readme.indexOf(startTag);
  const end = readme.indexOf(endTag);

  if (start !== -1 && end !== -1) {
    readme =
      readme.slice(0, start) + section + readme.slice(end + endTag.length);
  } else {
    readme = readme.trimEnd() + `\n\n${section}\n`;
  }

  await writeFile(readmePath, readme, 'utf-8');
}

async function readPackageName(absPath: string): Promise<string> {
  try {
    const raw = await readFile(join(absPath, 'package.json'), 'utf-8');
    const pkg = JSON.parse(raw) as { name?: string };
    return pkg.name ?? basename(absPath);
  } catch {
    return basename(absPath);
  }
}
