import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'yaml';

import { ProtocolClerk } from '@zok/domain/assistants';
import { DocumentProtocol } from '@zok/domain/document';
import { PleaType } from '@zok/domain/PleaType';

import { ZogConfig } from '../types/config';

const { ZOK_CONFIG_PATH = './config/zok.yml' } = process.env;

export class YamlProtocolClerk extends ProtocolClerk {
  public override async init(): Promise<void> {
    const { protocols } = await this.loadYamlConfig<ZogConfig>();

    let id;
    let protocol;

    for (const [key, value] of Object.entries(protocols)) {
      id = key as PleaType;
      protocol = new DocumentProtocol({ id, ...value });

      this.protocols.set(key, protocol);
    }
  }

  private async loadYamlConfig<T = unknown>(): Promise<T> {
    const filePath = path.resolve(ZOK_CONFIG_PATH);
    const content = await fs.readFile(filePath, 'utf-8');

    return yaml.parse(content);
  }
}
