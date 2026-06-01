import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Criterion } from '../../lore/scoring/criterion.entity';
import { CriterionRepository } from '../../lore/scoring/criterion.repository';

export type CriterionChanges = Partial<Pick<Criterion, 'name' | 'weights'>>;

export class UpdateCriterionCommand extends Command<Criterion> {
  public constructor(
    public readonly id: string,
    public readonly changes: CriterionChanges,
  ) {
    super();
  }
}

@CommandHandler(UpdateCriterionCommand)
export class UpdateCriterionHandler
  implements ICommandHandler<UpdateCriterionCommand>
{
  @Inject() private readonly criteria!: CriterionRepository;

  public async execute({
    id,
    changes,
  }: UpdateCriterionCommand): Promise<Criterion> {
    const criterion = await this.criteria.getByIdOrFail(id);

    criterion.update(changes);

    await this.criteria.save(criterion);

    return criterion;
  }
}
