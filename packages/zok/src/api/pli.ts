import { exit } from 'node:process';

import { program } from 'commander';

import { Zok } from '@zok/application/Zok';
import {
  FileSystemArchiveKeeper,
  NanoPleaFormalist,
  NunjucksScribe,
  YamlProtocolClerk,
} from '@zok/infrastructure/assistants';
import { PleaType } from '@zok/domain/entities';
import {
  MalformedDocumentError,
  NotFoundError,
  UnexpectedValueError,
} from '@zok/domain/errors';

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
  .command('close <protocol> <id>')
  .description('mark a document as done\n  Example: zok close task DOD-0001')
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, id: string, options: CommandOptions) => {
    await run(async () => {
      await zok.init();

      const result = await zok.handleTextPlea({
        protocol,
        type: PleaType.ChangeStatus,
        values: { id, status: 'done' },
      });

      await zok.announce(result, options.record);
    });
  });

program
  .command('reopen <protocol> <id>')
  .description(
    'mark a document as in progress\n  Example: zok reopen task DOD-0001',
  )
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, id: string, options: CommandOptions) => {
    await run(async () => {
      await zok.init();

      const result = await zok.handleTextPlea({
        protocol,
        type: PleaType.ChangeStatus,
        values: { id, status: 'inProgress' },
      });

      await zok.announce(result, options.record);
    });
  });

program
  .command('cancel <protocol> <id>')
  .description(
    'mark a document as cancelled\n  Example: zok cancel task DOD-0001',
  )
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, id: string, options: CommandOptions) => {
    await run(async () => {
      await zok.init();

      const result = await zok.handleTextPlea({
        protocol,
        type: PleaType.ChangeStatus,
        values: { id, status: 'cancelled' },
      });

      await zok.announce(result, options.record);
    });
  });

program
  .command('rename <protocol> <id> <title>')
  .description(
    'rename a document\n  Example: zok rename task DOD-0001 "Add login page"',
  )
  .option('-r, --record', 'show official activity record')
  .action(
    async (
      protocol: string,
      id: string,
      title: string,
      options: CommandOptions,
    ) => {
      await run(async () => {
        await zok.init();

        const result = await zok.handleTextPlea({
          protocol,
          type: PleaType.Rename,
          values: { id, title },
        });

        await zok.announce(result, options.record);
      });
    },
  );

program
  .command('delete <protocol> <id>')
  .description('delete a document\n  Example: zok delete task DOD-0001')
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, id: string, options: CommandOptions) => {
    await run(async () => {
      await zok.init();

      const result = await zok.handleTextPlea({
        protocol,
        type: PleaType.Delete,
        values: { id },
      });

      await zok.announce(result, options.record);
    });
  });

program
  .command('move <protocol> <id> <parent>')
  .description(
    'move a document under a different parent\n  Example: zok move task DOD-0001 Milestone-002',
  )
  .option('-r, --record', 'show official activity record')
  .action(
    async (
      protocol: string,
      id: string,
      parent: string,
      options: CommandOptions,
    ) => {
      await run(async () => {
        await zok.init();

        const result = await zok.handleTextPlea({
          protocol,
          type: PleaType.Move,
          values: { id, parent },
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
