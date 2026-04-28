import { NotFoundError } from '../errors/not-found.error';
import { EntityRepository } from './entity.repository';

/**
 * In-memory implementation of EntityRepository. Provides getById, find, and
 * save via a per-instance Map; intended for tests and prototypes where
 * persistence is out of scope.
 */
export abstract class InMemoryRepository<
  TEntity extends { id: string },
  TFindOptions = Partial<TEntity>,
> extends EntityRepository<TEntity, TFindOptions> {
  protected readonly entries = new Map<string, TEntity>();

  public getById(id: string): Promise<TEntity | undefined> {
    const found = [...this.entries.values()].find((entity) => entity.id === id);

    return Promise.resolve(found);
  }

  public async getByIdOrFail(id: string): Promise<TEntity> {
    const entity = await this.getById(id);

    if (entity === undefined) {
      throw new NotFoundError(`${this.entityName} "${id}" not found`);
    }

    return entity;
  }

  public find(filter?: TFindOptions): Promise<TEntity[]> {
    const matches = [...this.entries.values()].filter((entity) =>
      this.matches(entity, filter),
    );

    return Promise.resolve(matches);
  }

  public findOne(filter?: TFindOptions): Promise<TEntity | undefined> {
    const found = [...this.entries.values()].find((entity) =>
      this.matches(entity, filter),
    );

    return Promise.resolve(found);
  }

  public save(entity: TEntity): Promise<void> {
    this.entries.set(this.key(entity), entity);

    return Promise.resolve();
  }

  protected key(entity: TEntity): string {
    return entity.id;
  }

  protected matches(entity: TEntity, filter?: TFindOptions): boolean {
    return Object.entries(filter ?? {}).every(
      ([field, candidate]) =>
        (entity as Record<string, unknown>)[field] === candidate,
    );
  }

  protected abstract get entityName(): string;
}
