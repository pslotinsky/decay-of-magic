import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CitizenGate } from './frontier/gates/citizen.gate';
import { SessionGate } from './frontier/gates/session.gate';
import { PrismaService } from './ground/prisma.service';
import { PrismaCitizenPermitRepository } from './ground/repositories/prisma-citizen-permit.repository';
import { PrismaCitizenRepository } from './ground/repositories/prisma-citizen.repository';
import { RegisterCitizenHandler } from './law/commands/register-citizen.command';
import { UpdateCitizenHandler } from './law/commands/update-citizen.command';
import { GetCitizenHandler } from './law/queries/get-citizen.query';
import { ListCitizensHandler } from './law/queries/list-citizens.query';
import { CitizenPermitRepository } from './lore/repositories/citizen-permit.repository';
import { CitizenRepository } from './lore/repositories/citizen.repository';

const commandHandlers = [RegisterCitizenHandler, UpdateCitizenHandler];
const queryHandlers = [GetCitizenHandler, ListCitizensHandler];
const repositories = [
  { provide: CitizenRepository, useClass: PrismaCitizenRepository },
  { provide: CitizenPermitRepository, useClass: PrismaCitizenPermitRepository },
];
const services = [PrismaService];

@Module({
  imports: [CqrsModule],
  controllers: [CitizenGate, SessionGate],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    ...services,
  ],
})
export class AppModule {}
