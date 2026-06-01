import { Trial } from '../trial/trial.entity';
import { TrialSession, type TrialSetup } from './trial-session';

export type ExperimentRun = TrialSetup & {
  baseSeed: string;
  trialCount: number;
};

/**
 * Runs an Experiment's batch of Trials. Each Trial derives its own seed from
 * the base seed and plays on its own engine, so the batch is reproducible.
 */
export class ExperimentRunner {
  public run(run: ExperimentRun): Trial[] {
    return Array.from({ length: run.trialCount }, (_, index) =>
      new TrialSession(run, `${run.baseSeed}:${index}`).play(),
    );
  }
}
