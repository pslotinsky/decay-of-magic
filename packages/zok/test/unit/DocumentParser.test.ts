import test from 'node:test';
import assert from 'node:assert';

import { DocumentParser } from '@zok/domain/tools';
import {
  MalformedDocumentError,
  UnexpectedValueError,
} from '@zok/domain/errors';

import * as protocols from 'test/fixtures/protocols';

test.describe('Unit: ArchiveKeeper', () => {
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
    assert.strictEqual(doc.getValue('status'), 'Done');
    assert.deepStrictEqual(doc.getValue('created'), new Date('2025-07-17'));
  });

  test('parses document without table', () => {
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
    assert.strictEqual(doc.getValue('status'), undefined);
    assert.strictEqual(doc.getValue('created'), undefined);
  });

  test('parses document with partial table', () => {
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
    assert.strictEqual(doc.getValue('status'), 'Done');
    assert.strictEqual(doc.getValue('created'), undefined);
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

  test('throws if table without separator', () => {
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

  test(`throws if table contains unknown field`, () => {
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

  test('throws if table contains invalid value', () => {
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
});

function makeContent(lines: string[]): string {
  return lines.join('\n');
}
