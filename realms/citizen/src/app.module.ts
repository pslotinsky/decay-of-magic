import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

import { CitizenGate } from './frontier/gates/citizen.gate';
import { SessionGate } from './frontier/gates/session.gate';
import { PrismaService } from './ground/prisma.service';
import { PrismaCitizenPermitRepository } from './ground/repositories/prisma-citizen-permit.repository';
import { PrismaCitizenRepository } from './ground/repositories/prisma-citizen.repository';
import { CreateSessionHandler } from './law/commands/create-session.command';
import { RegisterCitizenHandler } from './law/commands/register-citizen.command';
import { UpdateCitizenHandler } from './law/commands/update-citizen.command';
import { GetCitizenHandler } from './law/queries/get-citizen.query';
import { ListCitizensHandler } from './law/queries/list-citizens.query';
import { ValidateTokenHandler } from './law/queries/validate-token.query';
import { CitizenPermitRepository } from './lore/repositories/citizen-permit.repository';
import { CitizenRepository } from './lore/repositories/citizen.repository';

const commandHandlers = [
  RegisterCitizenHandler,
  UpdateCitizenHandler,
  CreateSessionHandler,
];
const queryHandlers = [
  GetCitizenHandler,
  ListCitizensHandler,
  ValidateTokenHandler,
];
const repositories = [
  { provide: CitizenRepository, useClass: PrismaCitizenRepository },
  { provide: CitizenPermitRepository, useClass: PrismaCitizenPermitRepository },
];
const services = [PrismaService];

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [CitizenGate, SessionGate],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...repositories,
    ...services,
  ],
})
export class AppModule {}
