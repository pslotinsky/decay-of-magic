import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'yaml';

import { ProtocolClerk } from '@/domain/assistants';
import { DocumentProtocol, Dossier, PleaType } from '@/domain/entities';

import { Protocols } from '../types/config';

const { ZOK_CONFIG_PATH } = process.env;
const DEFAULT_CONFIG_PATH = path.resolve(
  __dirname,
  '../../../config/protocols.yml',
);

export class YamlProtocolClerk extends ProtocolClerk {
  public readonly dossier = new Dossier({
    name: 'Valen',
    age: 184,
    race: 'Vampire',
    gender: 'male',
    bio: 'Emotionless, precise, perfectly aligned with procedure. Capable of anything within protocol. Incapable of anything outside it. Has been known to wait indefinitely for proper authorization.',
  });

  public override async init(): Promise<void> {
    const protocols = await this.loadProtocols();

    let id;
    let protocol;

    for (const [key, value] of Object.entries(protocols)) {
      id = key as PleaType;
      protocol = DocumentProtocol.init({ id, ...value });

      this.protocols.set(key, protocol);
    }
  }

  private async loadProtocols(): Promise<Protocols> {
    const filePath = ZOK_CONFIG_PATH
      ? path.resolve(ZOK_CONFIG_PATH)
      : DEFAULT_CONFIG_PATH;
    const content = await fs.readFile(filePath, 'utf-8');

    return yaml.parse(content) as Protocols;
  }
}
