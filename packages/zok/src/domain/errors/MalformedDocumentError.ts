export class MalformedDocumentError extends Error {
  constructor(message: string) {
    super(`Malformed document: ${message}`);
  }
}
