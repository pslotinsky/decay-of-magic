type PickDefined<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: Exclude<
    T[K],
    undefined
  >;
};

export function pickDefined<T extends object>(obj: T): PickDefined<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as PickDefined<T>;
}
