import {
  ArchiveKeeper,
  HumorAdvisor,
  PleaFormalist,
  ProtocolClerk,
  Scribe,
} from '@zok/domain/assistants';

export type ZokAssistants = {
  pleaFormalist: PleaFormalist;
  scribe: Scribe;
  humorAdvisor: HumorAdvisor;
  protocolClerk: ProtocolClerk;
  archiveKeeper: ArchiveKeeper;
};
