import { z } from 'zod';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';

import { CitizenGate } from './frontier/gates/citizen.gate';
import { HealthGate } from './frontier/gates/health.gate';
import { SessionGate } from './frontier/gates/session.gate';
import { PrismaService } from './ground/prisma.service';
import { PrismaCitizenRepository } from './ground/repositories/prisma-citizen.repository';
import { PrismaCitizenPermitRepository } from './ground/repositories/prisma-citizen-permit.repository';
import { CreateSessionHandler } from './law/commands/create-session.command';
import { RegisterCitizenHandler } from './law/commands/register-citizen.command';
import { UpdateCitizenHandler } from './law/commands/update-citizen.command';
import { GetCitizenHandler } from './law/queries/get-citizen.query';
import { ListCitizensHandler } from './law/queries/list-citizens.query';
import { CitizenRepository } from './lore/repositories/citizen.repository';
import { CitizenPermitRepository } from './lore/repositories/citizen-permit.repository';

const commandHandlers = [
  RegisterCitizenHandler,
  UpdateCitizenHandler,
  CreateSessionHandler,
];
const queryHandlers = [GetCitizenHandler, ListCitizensHandler];
const repositories = [
  { provide: CitizenRepository, useClass: PrismaCitizenRepository },
  { provide: CitizenPermitRepository, useClass: PrismaCitizenPermitRepository },
];
const services = [PrismaService];

const { JWT_SECRET } = z
  .object({ JWT_SECRET: z.string().min(1) })
  .parse(process.env);

@Module({
  imports: [
    CqrsModule,
    TerminusModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [CitizenGate, HealthGate, SessionGate],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    ...services,
  ],
})
export class AppModule {}
