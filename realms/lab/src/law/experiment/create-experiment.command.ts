import { Inject } from '@nestjs/common';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CodexContentProvider } from '../../lore/experiment/codex-content-provider';
import { Experiment } from '../../lore/experiment/experiment.entity';
import { ExperimentRepository } from '../../lore/experiment/experiment.repository';
import { ExperimentFactory } from '../../lore/experiment/experiment-factory';
import { RulesetProvider } from '../../lore/experiment/ruleset-provider';
import type { Protocol } from '../../lore/protocol/protocol.entity';
import { ProtocolRepository } from '../../lore/protocol/protocol.repository';
import type { Criterion } from '../../lore/scoring/criterion.entity';
import { CriterionRepository } from '../../lore/scoring/criterion.repository';
import { FeatureCatalog } from '../../lore/scoring/feature-catalog';

export type CreateExperimentParams = {
  id: string;
  protocolId: string;
  trialCount: number;
  seed: string;
  createdAt: string;
  createdBy: string;
};

export class CreateExperimentCommand extends Command<Experiment> {
  public constructor(public readonly params: CreateExperimentParams) {
    super();
  }
}

@CommandHandler(CreateExperimentCommand)
export class CreateExperimentHandler
  implements ICommandHandler<CreateExperimentCommand>
{
  @Inject() private readonly protocols!: ProtocolRepository;
  @Inject() private readonly criteria!: CriterionRepository;
  @Inject() private readonly experiments!: ExperimentRepository;
  @Inject() private readonly catalog!: FeatureCatalog;
  @Inject() private readonly codexContent!: CodexContentProvider;
  @Inject() private readonly rulesets!: RulesetProvider;
  @Inject() private readonly factory!: ExperimentFactory;

  public async execute({
    params,
  }: CreateExperimentCommand): Promise<Experiment> {
    const protocol = await this.protocols.getByIdOrFail(params.protocolId);
    const experiment = this.factory.create({
      id: params.id,
      protocol,
      codex: await this.codexContent.get(protocol.universeId),
      ruleset: await this.rulesets.get(protocol.universeId),
      features: this.catalog.list(protocol.universeId),
      criteria: await this.resolveCriteria(protocol),
      trialCount: params.trialCount,
      seed: params.seed,
      createdAt: params.createdAt,
      createdBy: params.createdBy,
    });

    await this.experiments.save(experiment);
    return experiment;
  }

  private async resolveCriteria(
    protocol: Protocol,
  ): Promise<[Criterion, Criterion]> {
    const [first, second] = protocol.sides;

    return [
      await this.criteria.getByIdOrFail(first.criterionId),
      await this.criteria.getByIdOrFail(second.criterionId),
    ];
  }
}
