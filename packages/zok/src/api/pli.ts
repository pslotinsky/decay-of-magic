import { program } from 'commander';

import { Zok } from '@zok/application/Zok';
import {
  FileSystemArchiveKeeper,
  NanoPleaFormalist,
  NunjucksScribe,
  YamlProtocolClerk,
} from '@zok/infrastructure/assistants';
import { PleaType } from '@zok/domain/entities';

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
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, title: string, options: CommandOptions) => {
    await zok.init();

    const result = await zok.handleTextPlea({
      protocol,
      type: PleaType.Create,
      values: { title },
    });

    await zok.announce(result, options.record);
  });

program
  .command('close <protocol> <id>')
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, id: string, options: CommandOptions) => {
    await zok.init();

    const result = await zok.handleTextPlea({
      protocol,
      type: PleaType.ChangeStatus,
      values: { id, status: 'done' },
    });

    await zok.announce(result, options.record);
  });

program
  .command('reopen <protocol> <id>')
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, id: string, options: CommandOptions) => {
    await zok.init();

    const result = await zok.handleTextPlea({
      protocol,
      type: PleaType.ChangeStatus,
      values: { id, status: 'inProgress' },
    });

    await zok.announce(result, options.record);
  });

program
  .command('cancel <protocol> <id>')
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, id: string, options: CommandOptions) => {
    await zok.init();

    const result = await zok.handleTextPlea({
      protocol,
      type: PleaType.ChangeStatus,
      values: { id, status: 'cancelled' },
    });

    await zok.announce(result, options.record);
  });

program
  .command('rename <protocol> <id> <title>')
  .option('-r, --record', 'show official activity record')
  .action(
    async (
      protocol: string,
      id: string,
      title: string,
      options: CommandOptions,
    ) => {
      await zok.init();

      const result = await zok.handleTextPlea({
        protocol,
        type: PleaType.Rename,
        values: { id, title },
      });

      await zok.announce(result, options.record);
    },
  );

program
  .command('delete <protocol> <id>')
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, id: string, options: CommandOptions) => {
    await zok.init();

    const result = await zok.handleTextPlea({
      protocol,
      type: PleaType.Delete,
      values: { id },
    });

    await zok.announce(result, options.record);
  });

program
  .command('move <protocol> <id> <parent>')
  .option('-r, --record', 'show official activity record')
  .action(
    async (
      protocol: string,
      id: string,
      parent: string,
      options: CommandOptions,
    ) => {
      await zok.init();

      const result = await zok.handleTextPlea({
        protocol,
        type: PleaType.Move,
        values: { id, parent },
      });

      await zok.announce(result, options.record);
    },
  );

program
  .command('list <protocol>')
  .option('-r, --record', 'show official activity record')
  .action(async (protocol: string, options: CommandOptions) => {
    await zok.init();

    const result = await zok.handleTextPlea({
      protocol,
      type: PleaType.List,
      values: {},
    });

    await zok.announce(result, options.record);
  });

program.command('office').action(() => {
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
