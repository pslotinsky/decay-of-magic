import { Command } from '@nestjs/cqrs';

import { CreateSessionDto } from '@/frontier/dto/body/create-session.dto';
import { SessionDto } from '@/frontier/dto/session.dto';

export class CreateSessionCommand extends Command<SessionDto> {
  constructor(public readonly payload: CreateSessionDto) {
    super();
  }
}
