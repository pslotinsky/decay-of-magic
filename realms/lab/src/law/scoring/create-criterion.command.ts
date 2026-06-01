import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  Criterion,
  type CriterionParams,
} from '../../lore/scoring/criterion.entity';
import { CriterionRepository } from '../../lore/scoring/criterion.repository';

export class CreateCriterionCommand extends Command<Criterion> {
  public constructor(public readonly params: CriterionParams) {
    super();
  }
}

@CommandHandler(CreateCriterionCommand)
export class CreateCriterionHandler
  implements ICommandHandler<CreateCriterionCommand>
{
  @Inject() private readonly criteria!: CriterionRepository;

  public async execute({ params }: CreateCriterionCommand): Promise<Criterion> {
    const criterion = new Criterion(params);

    await this.criteria.save(criterion);

    return criterion;
  }
}
