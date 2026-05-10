import { isEqual, isUndefined, toPairs } from 'lodash';

export abstract class Entity {
  public update<T>(fields: Partial<T>): Set<keyof T> {
    const changes = new Set<keyof T>();

    for (const [key, value] of toPairs(fields)) {
      if (!isUndefined(value) && !isEqual(this[key], value)) {
        this[key] = value;
        changes.add(key as keyof T);
      }
    }

    return changes;
  }
}
