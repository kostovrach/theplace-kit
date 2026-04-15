export type M2AConstructor<Map> = {
    [Key in keyof Map]: {
        collection: Key;
        item: Map[Key];
        sort: number | null;
    };
}[keyof Map];