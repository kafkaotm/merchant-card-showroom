type Listener<T> = (value: T) => void;

export function createEntityStore<T>() {
  const entities = new Map<string, T>();
  const listeners = new Map<string, Set<Listener<T>>>();

  return {
    get(id: string): T | undefined {
      return entities.get(id);
    },
    set(id: string, value: T): void {
      entities.set(id, value);
      listeners.get(id)?.forEach((listener) => listener(value));
    },
    subscribe(id: string, listener: Listener<T>): () => void {
      const idListeners = listeners.get(id) ?? new Set();
      idListeners.add(listener);
      listeners.set(id, idListeners);

      return () => {
        idListeners.delete(listener);
        if (idListeners.size === 0) {
          listeners.delete(id);
        }
      };
    },
    subscribedIdCount(): number {
      return listeners.size;
    },
  };
}
