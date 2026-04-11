export abstract class Entity {
  public update<T extends object>(this: T, params: Partial<T>): Set<keyof T> {
    const changed = new Set<keyof T>();

    for (const key of Object.keys(params) as Array<keyof T & string>) {
      const value = params[key];
      if (value !== undefined && value !== this[key]) {
        this[key] = value;
        changed.add(key);
      }
    }

    return changed;
  }
}
