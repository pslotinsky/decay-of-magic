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

export async function renameMilestone(
  zok: Zok,
  id: string,
  title: string,
): Promise<Document> {
  return renameDocument(zok, 'milestone', id, title);
}

export async function renameTask(
  zok: Zok,
  id: string,
  title: string,
): Promise<Document> {
  return renameDocument(zok, 'task', id, title);
}

export async function deleteTask(zok: Zok, id: string): Promise<Document> {
  return deleteDocument(zok, 'task', id);
}

export async function changeTaskStatus(
  zok: Zok,
  id: string,
  status: string,
): Promise<Document> {
  return changeDocumentStatus(zok, 'task', id, status);
}

export async function moveTask(
  zok: Zok,
  id: string,
  parent: string,
): Promise<Document> {
  const { remark } = await zok.handleTextPlea({
    type: PleaType.Move,
    protocol: 'task',
    values: { id, parent },
  });

  if (!remark.result) {
    throw new Error('Remark suppose to contain document as result');
  }

  return remark.result;
}

export async function listDocuments(
  zok: Zok,
  protocol: string,
): Promise<Document[]> {
  const { remark } = await zok.handleTextPlea({
    type: PleaType.List,
    protocol,
    values: {},
  });

  if (!remark.result) {
    throw new Error('Remark suppose to contain documents as result');
  }

  return remark.result;
}

export async function createDocument(
  zok: Zok,
  protocol: string,
  values: Record<string, unknown>,
): Promise<Document> {
  const { remark } = await zok.handleTextPlea({
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

export async function renameDocument(
  zok: Zok,
  protocol: string,
  id: string,
  title: string,
): Promise<Document> {
  const { remark } = await zok.handleTextPlea({
    type: PleaType.Rename,
    protocol,
    values: { id, title },
  });

  if (!remark.result) {
    throw new Error('Remark suppose to contain document as result');
  }

  return remark.result;
}

export async function deleteDocument(
  zok: Zok,
  protocol: string,
  id: string,
): Promise<Document> {
  const { remark } = await zok.handleTextPlea({
    type: PleaType.Delete,
    protocol,
    values: { id },
  });

  if (!remark.result) {
    throw new Error('Remark suppose to contain document as result');
  }

  return remark.result;
}

export async function changeDocumentStatus(
  zok: Zok,
  protocol: string,
  id: string,
  status: string,
): Promise<Document> {
  const { remark } = await zok.handleTextPlea({
    type: PleaType.ChangeStatus,
    protocol,
    values: { id, status },
  });

  if (!remark.result) {
    throw new Error('Remark suppose to contain document as result');
  }

  return remark.result;
}
