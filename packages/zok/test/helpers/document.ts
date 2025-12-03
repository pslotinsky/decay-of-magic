import { Document, PleaType } from '@zok/domain/entities';
import { Zok } from '@zok/application/Zok';

export async function createMilestone(
  zok: Zok,
  values: Record<string, unknown>,
): Promise<Document> {
  return createDocument(zok, 'milestone', values);
}

export async function createTask(
  zok: Zok,
  values: Record<string, unknown>,
): Promise<Document> {
  return createDocument(zok, 'task', values);
}

export async function findMilestone(zok: Zok, id: string): Promise<Document> {
  return findDocument(zok, 'milestone', id);
}

export async function findTask(zok: Zok, id: string): Promise<Document> {
  return findDocument(zok, 'task', id);
}

export async function createDocument(
  zok: Zok,
  protocol: string,
  values: Record<string, unknown>,
): Promise<Document> {
  const remark = await zok.handleTextPlea({
    type: PleaType.Create,
    protocol,
    values,
  });

  if (!remark.result) {
    throw new Error('Remark suppose to contain document as result');
  }

  return remark.result;
}

export async function findDocument(
  zok: Zok,
  protocol: string,
  id: string,
): Promise<Document> {
  const [document] = await zok.findDocuments(protocol, id);

  if (!document) {
    throw new Error(`${protocol} with ${id} not found`);
  }

  return document;
}
