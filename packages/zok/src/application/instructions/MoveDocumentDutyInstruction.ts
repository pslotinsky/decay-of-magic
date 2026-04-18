import {
  Document,
  DocumentLink,
  DocumentProtocol,
  Remark,
} from '@/domain/entities';
import { UnexpectedValueError } from '@/domain/errors';

import { DutyInstruction, DutyInstructionParams } from './DutyInstruction';
import { UpdateDocumentRelationsDutyInstruction } from './UpdateDocumentRelationsDutyInstruction';

interface MoveDocumentDutyInstructionParams extends DutyInstructionParams {
  protocol: DocumentProtocol;
}

export class MoveDocumentDutyInstruction extends DutyInstruction<
  MoveDocumentDutyInstructionParams,
  Document
> {
  public async execute(): Promise<Remark<Document>> {
    const document = await this.getDocument(this.params.protocol);
    const prevParentLink = document.getField<DocumentLink>('parent');

    document.setField('parent', await this.resolveParentLink());
    await this.assistants.archiveKeeper.save(document);

    if (prevParentLink) {
      await this.cleanOldParentToc(document, prevParentLink);
    }

    return this.assistants.humorAdvisor.remarkOnDocumentMove(document);
  }

  private async resolveParentLink(): Promise<DocumentLink> {
    const { protocol } = this.params;
    const parentProtocolId = protocol.parentProtocolId;

    if (!parentProtocolId) {
      throw new UnexpectedValueError(
        protocol.id,
        `Protocol ${protocol.id} has no parent link field`,
      );
    }

    const parentProtocol =
      this.assistants.protocolClerk.getProtocol(parentProtocolId);
    const parentId = this.params.plea.getValue<string>('parent');
    const parentDocument = await this.assistants.archiveKeeper.findByIdOrFail(
      parentProtocol,
      parentId,
    );

    return DocumentLink.from(parentDocument);
  }

  private async cleanOldParentToc(
    document: Document,
    prevParentLink: DocumentLink,
  ): Promise<void> {
    const shell = Document.issue({
      content: '',
      metadata: {
        id: document.id,
        title: document.title,
        protocol: this.params.protocol,
        fields: { parent: prevParentLink },
      },
    });

    await new UpdateDocumentRelationsDutyInstruction({
      plea: this.params.plea,
      document: shell,
      assistants: this.assistants,
    }).execute();
  }
}
