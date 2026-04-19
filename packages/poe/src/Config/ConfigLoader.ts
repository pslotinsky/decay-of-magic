import { access } from 'fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'path';
import { z } from 'zod';

import { PoeConfig, PoeConfigSchema } from './PoeConfig';

const CONFIG_FILE = 'poe.config.mjs';

// Bypass tsc's CJS downlevel of `import()` so ESM config files still load
// eslint-disable-next-line @typescript-eslint/no-implied-eval
const dynamicImport = new Function('specifier', 'return import(specifier)') as (
  specifier: string,
) => Promise<{ default?: unknown }>;

/**
 * Resolves and loads the Poe configuration for a target package
 */
export class ConfigLoader {
  public async load(packagePath: string): Promise<PoeConfig> {
    const configPath = resolve(packagePath, CONFIG_FILE);

    await this.assertExists(configPath);

    const module = await dynamicImport(pathToFileURL(configPath).href);

    try {
      return PoeConfigSchema.parse(module.default);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid Poe config at ${configPath}:\n${z.prettifyError(error)}`,
          { cause: error },
        );
      }
      throw error;
    }
  }

  private async assertExists(configPath: string): Promise<void> {
    try {
      await access(configPath);
    } catch {
      throw new Error(`Poe config not found at ${configPath}`);
    }
  }
}
