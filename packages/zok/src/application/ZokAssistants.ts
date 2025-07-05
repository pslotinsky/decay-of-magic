import {
  Binder,
  ArchiveKeeper,
  HumorAdvisor,
  PleaFormalist,
  ProtocolClerk,
  Scribe,
} from '@zok/domain/assistants';

export type ZokAssistants = {
  pleaFormalist: PleaFormalist;
  scribe: Scribe;
  binder: Binder;
  humorAdvisor: HumorAdvisor;
  protocolClerk: ProtocolClerk;
  archiveKeeper: ArchiveKeeper;
};
