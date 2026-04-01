import { program } from 'commander';

import { Zok } from '@zok/application/Zok';
import {
  FileSystemArchiveKeeper,
  NanoPleaFormalist,
  NunjucksScribe,
  YamlProtocolClerk,
} from '@zok/infrastructure/assistants';
import { PleaType } from '@zok/domain/entities';

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
  .action(async (protocol: string, title: string) => {
    await zok.init();

    const remark = await zok.handleTextPlea({
      protocol,
      type: PleaType.Create,
      values: { title },
    });

    console.info(remark.toString());
  });

program
  .command('close <protocol> <id>')
  .action(async (protocol: string, id: string) => {
    await zok.init();

    const remark = await zok.handleTextPlea({
      protocol,
      type: PleaType.ChangeStatus,
      values: { id, status: 'done' },
    });

    console.info(remark.toString());
  });

program
  .command('reopen <protocol> <id>')
  .action(async (protocol: string, id: string) => {
    await zok.init();

    const remark = await zok.handleTextPlea({
      protocol,
      type: PleaType.ChangeStatus,
      values: { id, status: 'inProgress' },
    });

    console.info(remark.toString());
  });

program
  .command('cancel <protocol> <id>')
  .action(async (protocol: string, id: string) => {
    await zok.init();

    const remark = await zok.handleTextPlea({
      protocol,
      type: PleaType.ChangeStatus,
      values: { id, status: 'cancelled' },
    });

    console.info(remark.toString());
  });

program
  .command('list <protocol>')
  .action(async (protocol: string) => {
    await zok.init();

    const remark = await zok.handleTextPlea({
      protocol,
      type: PleaType.List,
      values: {},
    });

    console.info(remark.toString());
  });

program.parse();
