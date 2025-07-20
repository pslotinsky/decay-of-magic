import fs from 'node:fs/promises';
import path from 'node:path';

import yaml from 'yaml';

import { ProtocolClerk } from '@zok/domain/assistants';
import { DocumentProtocol, PleaType } from '@zok/domain/entities';

import { Protocols } from '../types/config';

const { ZOK_CONFIG_PATH = './config/protocols.yml' } = process.env;

export class YamlProtocolClerk extends ProtocolClerk {
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
    const filePath = path.resolve(ZOK_CONFIG_PATH);
    const content = await fs.readFile(filePath, 'utf-8');

    return yaml.parse(content);
  }
}
