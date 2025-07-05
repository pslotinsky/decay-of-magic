import { program } from 'commander';

import { Zok } from '@zok/application/Zok';
import {
  FileSystemArchiveKeeper,
  NanoPleaFormalist,
  YamlProtocolClerk,
} from '@zok/infrastructure/assistants';
import { PleaType } from '@zok/domain/plea/PleaType';

const zok = Zok.revealItself({
  pleaFormalist: new NanoPleaFormalist(),
  protocolClerk: new YamlProtocolClerk(),
  archiveKeeper: new FileSystemArchiveKeeper(),
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

    console.log(remark);
  });

program.parse();
