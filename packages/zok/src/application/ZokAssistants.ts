import {
  Binder,
  DocumentSeeker,
  HumorAdvisor,
  PleaFormalist,
  ProtocolClerk,
  Scribe,
} from '@zok/domain/assistants';

export type ZokAssistants = {
  formalist: PleaFormalist;
  scribe: Scribe;
  binder: Binder;
  humorAdvisor: HumorAdvisor;
  protocolClerk: ProtocolClerk;
  seeker: DocumentSeeker;
};
