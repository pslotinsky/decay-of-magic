import test from 'node:test';
import assert from 'node:assert';

import { DocumentStatus } from '@zok/domain/entities';
import { DocumentParser } from '@zok/domain/tools';
import {
  MalformedDocumentError,
  UnexpectedValueError,
} from '@zok/domain/errors';

import * as protocols from 'test/fixtures/protocols';

test.describe('Unit: DocumentParser', () => {
  test('parses correct markdown document', () => {
    const content = makeContent([
      '# DOD-0001: Test task',
      '',
      '| Field   | Value   |',
      '| ------- | ------- |',
      '| Status  | Done    |',
      '| Created | 2025-07-17 |',
    ]);

    const parser = new DocumentParser();
    const doc = parser.parse(protocols.task, content);

    assert.strictEqual(doc.id, 'DOD-0001');
    assert.strictEqual(doc.title, 'Test task');
    assert.strictEqual(doc.getField('status'), 'Done');
    assert.deepStrictEqual(doc.getField('created'), new Date('2025-07-17'));
  });

  test('parses document without fields', () => {
    const content = makeContent([
      '# DOD-0001: Test task',
      '',
      '## Description',
      '',
      'Test content',
    ]);

    const parser = new DocumentParser();
    const doc = parser.parse(protocols.task, content);

    assert.strictEqual(doc.id, 'DOD-0001');
    assert.strictEqual(doc.title, 'Test task');
    assert.strictEqual(doc.getField('status'), undefined);
    assert.strictEqual(doc.getField('created'), undefined);
  });

  test('parses document with partial fields table', () => {
    const content = makeContent([
      '# DOD-0001: Test task',
      '',
      '| Field   | Value   |',
      '| ------- | ------- |',
      '| Status  | Done    |',
    ]);

    const parser = new DocumentParser();
    const doc = parser.parse(protocols.task, content);

    assert.strictEqual(doc.id, 'DOD-0001');
    assert.strictEqual(doc.title, 'Test task');
    assert.strictEqual(doc.getField('status'), 'Done');
    assert.strictEqual(doc.getField('created'), undefined);
  });

  test('throws if title is missing', () => {
    const content = makeContent(['No heading here']);

    const parser = new DocumentParser();
    assert.throws(
      () => parser.parse(protocols.task, content),
      MalformedDocumentError,
    );
  });

  test('throws if title is malformed', () => {
    const content = makeContent(['# DOD-0001 Test task']);

    const parser = new DocumentParser();
    assert.throws(
      () => parser.parse(protocols.task, content),
      MalformedDocumentError,
    );
  });

  test('throws if fields table without separator', () => {
    const content = makeContent([
      '# DOD-0001: Test task',
      '',
      '| Field   | Value   |',
      '| Status  | Done    |',
    ]);

    const parser = new DocumentParser();
    assert.throws(
      () => parser.parse(protocols.task, content),
      MalformedDocumentError,
    );
  });

  test(`throws if fields contains unknown field`, () => {
    const content = makeContent([
      '# DOD-0001: Test task',
      '',
      '| Field    | Value   |',
      '| -------- | ------- |',
      '| Status   | Done    |',
      '| Unknown  | Unknown |',
    ]);

    const parser = new DocumentParser();
    assert.throws(
      () => parser.parse(protocols.task, content),
      UnexpectedValueError,
    );
  });

  test('throws if fields contains invalid value', () => {
    const content = makeContent([
      '# DOD-0001: Test task',
      '',
      '| Field   | Value   |',
      '| ------- | ------- |',
      '| Status  | Done    |',
      '| Created | 123qwe |',
    ]);

    const parser = new DocumentParser();
    assert.throws(
      () => parser.parse(protocols.task, content),
      UnexpectedValueError,
    );
  });

  test('parses table of content', () => {
    const content = makeContent([
      '# Milestone-001: Infrastructure and documentation',
      '',
      '## Tasks',
      '',
      '<!-- TOC.START: task -->',
      '- [x] [DOD-0001: Documentation structure](../tasks/DOD-0001_documentation-structure.md)',
      '~~- [ ] [DOD-0002: Monorepo](../tasks/DOD-0002_monorepo.md)~~',
      '- [ ] [DOD-0003: Draft services](../tasks/DOD-0003_draft-services.md)',
      '- [ ] [DOD-0004: Basic CI](../tasks/DOD-0004_basic-ci.md)',
      '<!-- TOC.END -->',
      '',
    ]);

    const parser = new DocumentParser();
    const doc = parser.parse(protocols.milestone, content);

    const { toc } = doc.metadata;
    assert.ok(toc);
    assert.equal(toc.protocolName, 'task');
    assert.equal(toc.lines.length, 4);
    assert.deepStrictEqual(toc.lines[0], {
      id: 'DOD-0001',
      title: 'Documentation structure',
      link: '../tasks/DOD-0001_documentation-structure.md',
      status: DocumentStatus.Done,
    });
    assert.deepStrictEqual(toc.lines[1], {
      id: 'DOD-0002',
      title: 'Monorepo',
      link: '../tasks/DOD-0002_monorepo.md',
      status: DocumentStatus.Cancelled,
    });
    assert.deepStrictEqual(toc.lines[2], {
      id: 'DOD-0003',
      title: 'Draft services',
      link: '../tasks/DOD-0003_draft-services.md',
      status: DocumentStatus.InProgress,
    });
    assert.deepStrictEqual(toc.lines[3], {
      id: 'DOD-0004',
      title: 'Basic CI',
      link: '../tasks/DOD-0004_basic-ci.md',
      status: DocumentStatus.InProgress,
    });
  });
});

function makeContent(lines: string[]): string {
  return lines.join('\n');
}
