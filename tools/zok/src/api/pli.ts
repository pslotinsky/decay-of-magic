import { program } from 'commander';
import { exit } from 'node:process';

import { Zok } from '@/application/Zok';
import { PleaType } from '@/domain/entities';
import {
  MalformedDocumentError,
  NotFoundError,
  UnexpectedValueError,
} from '@/domain/errors';
import {
  FileSystemArchiveKeeper,
  NanoPleaFormalist,
  NunjucksScribe,
  YamlProtocolClerk,
} from '@/infrastructure/assistants';

type CommandOptions = {
  record?: boolean;
};

const zok = Zok.revealItself({
  pleaFormalist: new NanoPleaFormalist(),
  protocolClerk: new YamlProtocolClerk(),
  archiveKeeper: new FileSystemArchiveKeeper(),
  scribe: new NunjucksScribe(),
});

const DESCRIPTION = `
╭────────────────────────────────╮
│         ZOK PLI v0.0.1         │
│  Senior Orc Archivist on duty  │
╰────────────────────────────────╯
`;

program.name('zok').description(DESCRIPTION);

program
  .command('create <protocol> <title>')
  .description(
    'create a new document\n  Example: zok create task "Add login page"',
  )
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, title: string, options: CommandOptions) => {
    await run(async () => {
      await zok.init();

      const result = await zok.handleTextPlea({
        protocol,
        type: PleaType.Create,
        values: { title },
      });

      await zok.announce(result, options.record);
    });
  });

program
  .command('close <protocolOrDocumentId> [documentId]')
  .description(
    'mark a document as done\n  Example: zok close DOD-0001 (protocol inferred)\n  Example: zok close task DOD-0001 (explicit protocol)',
  )
  .option('-r, --record', 'show official activity record')
  .action(
    async (
      protocolOrDocumentId: string,
      documentId: string | undefined,
      options: CommandOptions,
    ) => await changeStatus(protocolOrDocumentId, documentId, 'done', options),
  );

program
  .command('reopen <protocolOrDocumentId> [documentId]')
  .description(
    'mark a document as in progress\n  Example: zok reopen DOD-0001 (protocol inferred)\n  Example: zok reopen task DOD-0001 (explicit protocol)',
  )
  .option('-r, --record', 'show official activity record')
  .action(
    async (
      protocolOrDocumentId: string,
      documentId: string | undefined,
      options: CommandOptions,
    ) =>
      await changeStatus(
        protocolOrDocumentId,
        documentId,
        'inProgress',
        options,
      ),
  );

program
  .command('cancel <protocolOrDocumentId> [documentId]')
  .description(
    'mark a document as cancelled\n  Example: zok cancel DOD-0001 (protocol inferred)\n  Example: zok cancel task DOD-0001 (explicit protocol)',
  )
  .option('-r, --record', 'show official activity record')
  .action(
    async (
      protocolOrDocumentId: string,
      documentId: string | undefined,
      options: CommandOptions,
    ) =>
      await changeStatus(
        protocolOrDocumentId,
        documentId,
        'cancelled',
        options,
      ),
  );

program
  .command('rename <protocolOrDocumentId> <documentIdOrTitle> [title]')
  .description(
    'rename a document\n  Example: zok rename DOD-0001 "Add login page" (protocol inferred)\n  Example: zok rename task DOD-0001 "Add login page" (explicit protocol)',
  )
  .option('-r, --record', 'show official activity record')
  .action(
    async (
      protocolOrDocumentId: string,
      documentIdOrTitle: string,
      title: string | undefined,
      options: CommandOptions,
    ) => {
      await run(async () => {
        await zok.init();

        const resolved = resolveWithExtra(
          protocolOrDocumentId,
          documentIdOrTitle,
          title,
        );

        const result = await zok.handleTextPlea({
          protocol: resolved.protocol,
          type: PleaType.Rename,
          values: { id: resolved.documentId, title: resolved.extra },
        });

        await zok.announce(result, options.record);
      });
    },
  );

program
  .command('delete <protocolOrDocumentId> [documentId]')
  .description(
    'delete a document\n  Example: zok delete DOD-0001 (protocol inferred)\n  Example: zok delete task DOD-0001 (explicit protocol)',
  )
  .option('-r, --record', 'show official activity record')
  .action(
    async (
      protocolOrDocumentId: string,
      documentId: string | undefined,
      options: CommandOptions,
    ) => {
      await run(async () => {
        await zok.init();

        const resolved = resolve(protocolOrDocumentId, documentId);

        const result = await zok.handleTextPlea({
          protocol: resolved.protocol,
          type: PleaType.Delete,
          values: { id: resolved.documentId },
        });

        await zok.announce(result, options.record);
      });
    },
  );

program
  .command('move <protocolOrDocumentId> <documentIdOrParent> [parent]')
  .description(
    'move a document under a different parent\n  Example: zok move DOD-0001 Milestone-002 (protocol inferred)\n  Example: zok move task DOD-0001 Milestone-002 (explicit protocol)',
  )
  .option('-r, --record', 'show official activity record')
  .action(
    async (
      protocolOrDocumentId: string,
      documentIdOrParent: string,
      parent: string | undefined,
      options: CommandOptions,
    ) => {
      await run(async () => {
        await zok.init();

        const resolved = resolveWithExtra(
          protocolOrDocumentId,
          documentIdOrParent,
          parent,
        );

        const result = await zok.handleTextPlea({
          protocol: resolved.protocol,
          type: PleaType.Move,
          values: { id: resolved.documentId, parent: resolved.extra },
        });

        await zok.announce(result, options.record);
      });
    },
  );

program
  .command('list <protocol>')
  .description(
    'list all documents of a given protocol\n  Example: zok list tasks',
  )
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, options: CommandOptions) => {
    await run(async () => {
      await zok.init();

      const result = await zok.handleTextPlea({
        protocol,
        type: PleaType.List,
        values: {},
      });

      await zok.announce(result, options.record);
    });
  });

program
  .command('office')
  .description('display the ZOK office — all staff members and their profiles')
  .action(() => {
    const officials = [zok, ...Object.values(zok.assistants)];

    console.info('ZOK OFFICE');
    console.info('════════════════════════════════════════');
    console.info();

    for (const official of officials) {
      const { dossier } = official;

      console.info(`${dossier.name} — ${official.title}`);
      console.info(
        `  ${dossier.race} • ${dossier.age} years • ${dossier.gender}`,
      );
      console.info(`  ${dossier.bio}`);
      console.info();
    }
  });

program.parse();

async function run(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof MalformedDocumentError ||
      error instanceof UnexpectedValueError
    ) {
      console.error(error.message);
      exit(1);
    }
    throw error;
  }
}

async function changeStatus(
  protocolOrDocumentId: string,
  documentId: string | undefined,
  status: 'done' | 'inProgress' | 'cancelled',
  options: CommandOptions,
): Promise<void> {
  await run(async () => {
    await zok.init();

    const resolved = resolve(protocolOrDocumentId, documentId);

    const result = await zok.handleTextPlea({
      protocol: resolved.protocol,
      type: PleaType.ChangeStatus,
      values: { id: resolved.documentId, status },
    });

    await zok.announce(result, options.record);
  });
}

// When only one positional is given, it's the document id and the protocol is
// inferred from its prefix. When two are given, the first is the explicit
// protocol and the second is the document id.
function resolve(
  protocolOrDocumentId: string,
  documentId: string | undefined,
): { protocol: string; documentId: string } {
  if (documentId === undefined) {
    return {
      protocol: zok.inferProtocolFromDocumentId(protocolOrDocumentId),
      documentId: protocolOrDocumentId,
    };
  }

  return { protocol: protocolOrDocumentId, documentId };
}

// Same dispatch as `resolve`, with one trailing argument (title / parent).
function resolveWithExtra(
  protocolOrDocumentId: string,
  documentIdOrExtra: string,
  extra: string | undefined,
): { protocol: string; documentId: string; extra: string } {
  if (extra === undefined) {
    return {
      protocol: zok.inferProtocolFromDocumentId(protocolOrDocumentId),
      documentId: protocolOrDocumentId,
      extra: documentIdOrExtra,
    };
  }

  return {
    protocol: protocolOrDocumentId,
    documentId: documentIdOrExtra,
    extra,
  };
}
