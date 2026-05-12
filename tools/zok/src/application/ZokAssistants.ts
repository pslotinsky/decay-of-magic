import {
  ArchiveKeeper,
  HumorAdvisor,
  PleaFormalist,
  ProtocolClerk,
  Scribe,
} from '@/domain/assistants';

export type ZokAssistants = {
  pleaFormalist: PleaFormalist;
  scribe: Scribe;
  humorAdvisor: HumorAdvisor;
  protocolClerk: ProtocolClerk;
  archiveKeeper: ArchiveKeeper;
};
