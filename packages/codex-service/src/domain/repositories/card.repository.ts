import { Card } from '../entities/card.entity';

export abstract class CardRepository {
  public abstract getById(id: string): Promise<Card | undefined>;
  public abstract getByIdOrFail(id: string): Promise<Card>;
  public abstract find(): Promise<Card[]>;
  public abstract save(card: Card): Promise<void>;
}
