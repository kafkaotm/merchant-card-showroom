export function createLocalStoragePersistence<T>(namespace: string) {
  const keyFor = (id: string) => `${namespace}:${id}`;

  return {
    save(id: string, value: T): void {
      localStorage.setItem(keyFor(id), JSON.stringify(value));
    },
    load(id: string): T | undefined {
      const raw = localStorage.getItem(keyFor(id));
      if (raw === null) return undefined;

      try {
        return JSON.parse(raw) as T;
      } catch (error) {
        console.warn(`Discarding corrupted localStorage value for "${keyFor(id)}".`, error);
        return undefined;
      }
    },
  };
}
