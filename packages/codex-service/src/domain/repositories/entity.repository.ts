export abstract class EntityRepository<TEntity extends { id: string }> {
  public abstract getById(id: string): Promise<TEntity | undefined>;
  public abstract getByIdOrFail(id: string): Promise<TEntity>;
  public abstract find(): Promise<TEntity[]>;
  public abstract save(entity: TEntity): Promise<void>;
}
