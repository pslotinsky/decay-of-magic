// Behavioral spec for the Experiment + Trial HTTP surface. Shapes live in
// `@dod/api-contract` (lab); DOD-0030 builds the realm that turns these green.

describe('ExperimentGate (api)', () => {
  describe('POST /v1/experiment', () => {
    it.todo('creates and starts an Experiment with status "pending"');
    it.todo('accepts a provided seed or generates one');
    it.todo('snapshots the resolved Protocol and Codex content');
    it.todo('400 when protocolId is unresolved');
    it.todo('400 on a trialCount below 1');
  });

  describe('GET /v1/experiment', () => {
    it.todo('filters by protocolId');
    it.todo(
      'returns an Experiment by id, including status and findings when done',
    );
    it.todo('404 for an unknown id');
  });

  describe('GET /v1/experiment/:id/trial', () => {
    it.todo('returns trial summaries (id, outcome, turnsPlayed)');
    it.todo('returns a full Trial log when the Trial was retained');
    it.todo('404 when the Trial was not sampled');
    it.todo('404 when the Experiment does not exist');
  });
});
