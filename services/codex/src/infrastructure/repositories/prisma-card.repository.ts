import { Card } from '@domain/entities/card.entity';
import { CardRepository } from '@domain/repositories/card.repository';

export class PrismaCardRepository implements CardRepository {
  public async getById(_id: string): Promise<Card | undefined> {
    throw new Error('Method not implemented.');
  }

  public async getByIdOrFail(_id: string): Promise<Card> {
    throw new Error('Method not implemented.');
  }

  public async find(): Promise<Card[]> {
    return [];
  }

  public async save(_card: Card): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
