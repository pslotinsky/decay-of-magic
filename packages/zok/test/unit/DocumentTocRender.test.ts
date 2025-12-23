import test from 'node:test';
import assert from 'node:assert';

import { DocumentStatus, DocumentToc } from '@zok/domain/entities';
import { DocumentTocRender } from '@zok/domain/tools';

test.describe('Unit: DocumentTocRender', () => {
  test('rendered table of content', () => {
    const toc: DocumentToc = {
      protocolName: 'task',
      lines: [
        {
          id: 'DOD-0001',
          title: 'Documentation structure',
          link: '../tasks/DOD-0001_documentation-structure.md',
          status: DocumentStatus.Done,
        },
        {
          id: 'DOD-0002',
          title: 'Monorepo',
          link: '../tasks/DOD-0002_monorepo.md',
          status: DocumentStatus.Cancelled,
        },
        {
          id: 'DOD-0003',
          title: 'Draft services',
          link: '../tasks/DOD-0003_draft-services.md',
          status: DocumentStatus.InProgress,
        },
        {
          id: 'DOD-0004',
          title: 'Basic CI',
          link: '../tasks/DOD-0004_basic-ci.md',
          status: DocumentStatus.InProgress,
        },
      ],
    };

    const tocContent = DocumentTocRender.render(toc);

    assert.deepStrictEqual(tocContent.split('\n'), [
      '<!-- TOC.START: task -->',
      '- [x] [DOD-0001: Documentation structure](../tasks/DOD-0001_documentation-structure.md)',
      '~~- [ ] [DOD-0002: Monorepo](../tasks/DOD-0002_monorepo.md)~~',
      '- [ ] [DOD-0003: Draft services](../tasks/DOD-0003_draft-services.md)',
      '- [ ] [DOD-0004: Basic CI](../tasks/DOD-0004_basic-ci.md)',
      '<!-- TOC.END -->',
    ]);
  });
});
