export function createEntityStore<T>() {
  const entities = new Map<string, T>();

  return {
    get(id: string): T | undefined {
      return entities.get(id);
    },
    set(id: string, value: T): void {
      entities.set(id, value);
    },
  };
}
