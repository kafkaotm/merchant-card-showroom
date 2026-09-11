export function createLocalStoragePersistence<T>(namespace: string) {
  const keyFor = (id: string) => `${namespace}:${id}`;

  return {
    save(id: string, value: T): void {
      try {
        localStorage.setItem(keyFor(id), JSON.stringify(value));
      } catch (error) {
        console.warn(`Could not persist "${keyFor(id)}" (storage full or unavailable).`, error);
      }
    },
    load(id: string): T | undefined {
      try {
        const raw = localStorage.getItem(keyFor(id));
        return raw === null ? undefined : (JSON.parse(raw) as T);
      } catch (error) {
        console.warn(`Discarding unreadable localStorage value for "${keyFor(id)}".`, error);
        return undefined;
      }
    },
  };
}
