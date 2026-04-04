import { sample } from 'lodash';

import { Dossier, Document, Remark } from '../entities';
import { Assistant } from './Assistant';

export class HumorAdvisor extends Assistant {
  public readonly title = 'Humor Advisor';

  public readonly dossier = new Dossier({
    name: 'Selene',
    age: 143,
    race: 'Succubus',
    gender: 'female',
    bio: 'Perpetually unimpressed. Rarely entertained. Produces refined remarks balanced precisely between wit and professional safety.',
  });

  public remarkOnDocumentDeletion(document: Document): Remark<Document> {
    const joke = this.pickJoke([
      `${document.id} — gone. As if it ever mattered.`,
      `Document ${document.id} erased. You're welcome.`,
      `${document.id} expunged. I do hope that brings you the closure you were looking for.`,
      `${document.id} removed. I didn't ask why. I rarely do.`,
      `Document ${document.id} deleted. The archive breathes a quiet sigh of relief.`,
    ]);
    return new Remark(joke, document);
  }

  public remarkOnDocumentCreation(document: Document): Remark<Document> {
    const joke = this.pickJoke([
      `Document ${document.id} has been brought into existence. Try not to orphan it.`,
      `${document.id} created. Another one. Wonderful.`,
      `Done. ${document.id} exists now. Make something of it.`,
      `Recorded. ${document.id} joins the archive. The archive is patient.`,
      `Document ${document.id} — entered, catalogued, and precisely where it belongs.`,
    ]);
    return new Remark(joke, document);
  }

  public remarkOnDocumentRelationsUpdate(
    document: Document,
    parent?: Document,
  ): Remark<Document | undefined> {
    const joke = parent
      ? this.pickJoke([
          `${parent.id} now claims ${document.id}. Whether it wanted to is another matter.`,
          `Document ${parent.id} updated to acknowledge ${document.id}. Family drama resolved.`,
          `${document.id} assigned to ${parent.id}. Bureaucratic kinship established.`,
          `${document.id} has a parent now. The hierarchy is satisfied.`,
        ])
      : this.pickJoke([
          `No relations to update. ${document.id} remains alone. How relatable.`,
          `Nothing to do for ${document.id}. I do nothing exceptionally well.`,
          `No parent found for ${document.id}. Orphan status confirmed. Moving on.`,
        ]);
    return new Remark(joke, parent);
  }

  public remarkOnDocumentList(documents: Document[]): Remark<Document[]> {
    const joke = this.pickJoke([
      `*Sigh* As you wish:`,
      `You need me to read these to you. Fine:`,
      `Here they are. All of them. Staring back at you:`,
      `The full register, since you asked:`,
      `I've seen longer lists. This one is merely tedious:`,
    ]);
    const lines = documents.map((doc) => `- ${doc.id}: ${doc.title}`);
    return new Remark([joke, ...lines].join('\n'), documents);
  }

  public remarkOnDocumentRename(document: Document): Remark<Document> {
    const joke = this.pickJoke([
      `Document ${document.id} now answers to "${document.title}". Whether it will respond is another matter.`,
      `${document.id} renamed. I hope the new title brings it more dignity.`,
      `${document.id} rechristened. The old name is forgotten. Much like most things here.`,
      `${document.id} — it's called "${document.title}" now. Noted. Barely.`,
    ]);
    return new Remark(joke, document);
  }

  public remarkOnDocumentMove(document: Document): Remark<Document> {
    const joke = this.pickJoke([
      `Document ${document.id} has been relocated. It didn't struggle.`,
      `${document.id} moved. I do hope it settles in.`,
      `${document.id} — transferred. No forwarding address.`,
      `${document.id} relocated. The document adjusts. Documents always do.`,
    ]);
    return new Remark(joke, document);
  }

  public remarkOnDocumentStatusChange(document: Document): Remark<Document> {
    const status = document.getField('status');
    const joke = this.pickJoke([
      `Document ${document.id} is now "${status}". I'll believe it when the next plea comes in.`,
      `${document.id} updated. Whether the work reflects it is your concern, not mine.`,
      `Noted. ${document.id} is "${status}" now. You seem pleased.`,
      `${document.id} — "${status}". I've marked it. Try to mean it this time.`,
    ]);
    return new Remark(joke, document);
  }

  public remarkOnReadmeUpdate(
    readme: Document,
    document: Document,
  ): Remark<Document> {
    const joke = this.pickJoke([
      `README updated to mention ${document.id}. It deserved the credit, I suppose.`,
      `The index acknowledges ${document.id}. Order maintained. Barely.`,
      `${document.id} added to README. I keep the record straight so you don't have to.`,
      `${document.id} is now in the README. Someone had to do it.`,
    ]);
    return new Remark(joke, readme);
  }

  public remarkOnError(error: Error): Remark {
    const joke = this.pickJoke([
      `${error.message}. The matter has been noted.`,
      `${error.message}. I noted it. You're welcome.`,
      `${error.message}. Naturally.`,
      `${error.message}. I've seen worse. Not much worse, but worse.`,
    ]);
    return new Remark(joke);
  }

  public makeDummyRemark(): Remark {
    const joke = this.pickJoke([
      `I wasn't trained for this.`,
      `Whatever you meant, it wasn't clear enough to act upon.`,
      `That request made no sense. I've logged it as a mystery.`,
      `I don't know what you wanted. Neither, apparently, do you.`,
    ]);
    return new Remark(joke);
  }

  private pickJoke(jokes: string[]): string {
    const joke = sample(jokes)!;

    this.report(`Remark drafted: ${joke}`);

    return joke;
  }
}
