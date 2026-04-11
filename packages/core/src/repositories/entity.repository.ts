/**
 * Abstract base for domain repositories. Defines the standard CRUD contract
 * that all entity repositories must implement.
 */
export abstract class EntityRepository<
  TEntity extends { id: string },
  TFindOptions = Partial<TEntity>,
> {
  public abstract getById(id: string): Promise<TEntity | undefined>;
  public abstract getByIdOrFail(id: string): Promise<TEntity>;
  public abstract find(filter?: TFindOptions): Promise<TEntity[]>;
  public abstract save(entity: TEntity): Promise<void>;
}
