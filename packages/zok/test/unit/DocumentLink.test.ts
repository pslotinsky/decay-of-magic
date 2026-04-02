import test from 'node:test';
import assert from 'node:assert';

import { DocumentLink } from '@zok/domain/entities';

test.describe('Unit: DocumentLink', () => {
  test('parses markdown link into DocumentLink', () => {
    const link = DocumentLink.parse(
      '[Hello task](../tasks/DOD-0001_hello-task.md)',
    );

    assert.deepStrictEqual(link, new DocumentLink(
      'DOD-0001',
      'Hello task',
      '../tasks/DOD-0001_hello-task.md',
    ));
  });

  test('returns undefined for plain string', () => {
    const link = DocumentLink.parse('DOD-0001');

    assert.equal(link, undefined);
  });

  test('renders as markdown link', () => {
    const link = new DocumentLink(
      'DOD-0001',
      'Hello task',
      '../tasks/DOD-0001_hello-task.md',
    );

    assert.equal(link.toString(), '[Hello task](../tasks/DOD-0001_hello-task.md)');
  });

  test('parse and toString are inverse operations', () => {
    const original = '[Hello task](../tasks/DOD-0001_hello-task.md)';
    const link = DocumentLink.parse(original);

    assert.equal(link?.toString(), original);
  });
});
