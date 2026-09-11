export interface CardDefinition<TSchema, TView> {
  schema: TSchema;
  views: Record<string, TView>;
}

export function createCardRegistry<TSchema, TView>() {
  const definitions = new Map<string, CardDefinition<TSchema, TView>>();

  return {
    register(type: string, definition: CardDefinition<TSchema, TView>): void {
      if (definitions.has(type)) {
        throw new Error(`Card type "${type}" is already registered.`);
      }
      definitions.set(type, definition);
    },
    get(type: string): CardDefinition<TSchema, TView> | undefined {
      return definitions.get(type);
    },
    getView(type: string, viewName: string): TView | undefined {
      return definitions.get(type)?.views[viewName];
    },
  };
}
