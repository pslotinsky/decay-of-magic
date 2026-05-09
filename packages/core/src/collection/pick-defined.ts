type PickDefined<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
} & {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<
    T[K],
    undefined
  >;
};

export function pickDefined<T extends object>(obj: T): PickDefined<T> {
  const result = {} as PickDefined<T>;

  for (const key of Object.keys(obj) as (keyof T)[]) {
    const value = obj[key];
    if (value !== undefined) {
      (result as unknown as Record<keyof T, unknown>)[key] = value;
    }
  }

  return result;
}
