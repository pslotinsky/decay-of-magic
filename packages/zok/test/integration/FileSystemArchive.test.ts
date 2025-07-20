import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { FileSystemArchive } from '@zok/infrastructure/archive';
import { Document } from '@zok/domain/entities';

import * as protocols from 'test/fixtures/protocols';

let tmpDir: string;

test.describe('Integration: FileSystemArchive', () => {
  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'zok-'));
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  test(`saves document to disk`, async () => {
    const archive = new FileSystemArchive(tmpDir);

    const doc = Document.issue({
      metadata: {
        id: 'DOD-0001',
        protocol: protocols.task,
        title: 'Test Document',
        fields: {},
      },
      content: '# DOD-0001: Test Document',
    });

    await archive.save(doc);

    const filePath = join(tmpDir, 'tasks', 'DOD-0001_test-document.md');
    const content = await readFile(filePath, 'utf-8');

    assert.equal(content, '# DOD-0001: Test Document');
  });

  test('finds documents by protocol', async () => {
    const archive = new FileSystemArchive(tmpDir);

    const doc = Document.issue({
      metadata: {
        id: 'DOD-0001',
        protocol: protocols.task,
        title: 'Test Document',
        fields: {},
      },
      content: '# DOD-0001: Test Document',
    });

    await archive.save(doc);

    const found = await archive.find({ protocol: protocols.task });

    assert.equal(found.length, 1);
    assert.equal(found[0].id, 'DOD-0001');
  });

  test('counts documents correctly', async () => {
    const archive = new FileSystemArchive(tmpDir);

    await archive.save(
      Document.issue({
        metadata: {
          id: 'DOD-0001',
          protocol: protocols.task,
          title: 'Test Document 1',
          fields: {},
        },
        content: '# DOD-0001: Test Document 1',
      }),
    );

    await archive.save(
      Document.issue({
        metadata: {
          id: 'DOD-0002',
          protocol: protocols.task,
          title: 'Test Document 2',
          fields: {},
        },
        content: '# DOD-0001: Test Document 2',
      }),
    );

    const count = await archive.count({ protocol: protocols.task });
    assert.equal(count, 2);
  });

  test('returns empty if nothing found', async () => {
    const archive = new FileSystemArchive(tmpDir);

    const found = await archive.find({ protocol: protocols.task });
    assert.deepEqual(found, []);

    const count = await archive.count({ protocol: protocols.task });
    assert.equal(count, 0);
  });
});
