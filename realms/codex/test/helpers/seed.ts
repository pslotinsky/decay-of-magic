import { INestApplication } from '@nestjs/common';

import { postOk } from './http';
import { mocker } from './mocker';

export async function seedCodex(
  app: INestApplication,
  universeId = 'eldoria',
): Promise<void> {
  await postOk(
    app,
    '/api/v1/element',
    mocker.element.createBody({ universeId }),
  );
  await postOk(
    app,
    '/api/v1/element',
    mocker.element.createBody({ id: 'water', name: 'Water', universeId }),
  );
  await postOk(
    app,
    '/api/v1/faction',
    mocker.faction.createBody({ universeId }),
  );
  await postOk(app, '/api/v1/stat', mocker.stat.createBody({ universeId }));
  await postOk(
    app,
    '/api/v1/stat',
    mocker.stat.createBody({
      id: 'health',
      name: 'Health',
      appliesTo: ['minion', 'hero'],
      universeId,
    }),
  );
  await postOk(
    app,
    '/api/v1/stat',
    mocker.stat.createBody({
      id: 'spellDamage',
      name: 'Spell Damage',
      appliesTo: ['hero'],
      universeId,
    }),
  );
  await postOk(
    app,
    '/api/v1/stat',
    mocker.stat.createBody({
      id: 'fireGrowth',
      name: 'Fire Growth',
      appliesTo: ['hero'],
      universeId,
    }),
  );
  await postOk(app, '/api/v1/trait', mocker.trait.createBody({ universeId }));
  await postOk(
    app,
    '/api/v1/trait',
    mocker.trait.createBody({
      id: 'spell',
      name: 'Spell',
      appliesTo: ['card'],
      universeId,
    }),
  );
  await postOk(
    app,
    '/api/v1/trait',
    mocker.trait.createBody({
      id: 'charge',
      name: 'Charge',
      appliesTo: ['minion', 'hero'],
      universeId,
    }),
  );
  await postOk(
    app,
    '/api/v1/trait',
    mocker.trait.createBody({
      id: 'heroOnly',
      name: 'Hero Only',
      appliesTo: ['hero'],
      universeId,
    }),
  );
}
