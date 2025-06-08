import { NotFoundException } from '@nestjs/common';

type Delegate<TModel extends { id: string }> = {
  findFirst(args: any): Promise<TModel | null>;
  findMany(args?: any): Promise<TModel[]>;
  upsert(args: any): Promise<any>;
};

export abstract class PrismaRepository<
  TEntity extends { id: string },
  TModel extends { id: string },
> {
  public async getById(id: string): Promise<TEntity | undefined> {
    const model = await this.delegate.findFirst({ where: { id } });

    return model ? this.toEntity(model) : undefined;
  }

  public async getByIdOrFail(id: string): Promise<TEntity> {
    const entity = await this.getById(id);

    if (!entity) {
      throw new NotFoundException(`Entity ${id} not found`);
    }

    return entity;
  }

  public async find(): Promise<TEntity[]> {
    const models = await this.delegate.findMany();

    return models.map((model) => this.toEntity(model));
  }

  public async save(entity: TEntity): Promise<void> {
    const model = this.toModel(entity);

    await this.delegate.upsert({
      where: { id: model.id },
      create: model,
      update: model,
    });
  }

  protected abstract get delegate(): Delegate<TModel>;
  protected abstract toEntity(model: TModel): TEntity;
  protected abstract toModel(entity: TEntity): TModel;
}
