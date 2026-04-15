/**
 * Универсальный тип для M2A (many-to-any / matrix / polymorphic relation)
 *
 * Преобразует карту коллекций в union-тип объектов,
 * где каждый элемент содержит:
 * - название коллекции
 * - тип элемента этой коллекции
 * - порядок сортировки
 *
 * @template Map - объект, где ключ = имя коллекции, значение = тип элемента
 *
 * @example
 * type Map = {
 *   articles: Article;
 *   pages: Page;
 * };
 *
 * type Result = M2AConstructor<Map>;
 * // =>
 * // | { collection: "articles"; item: Article; sort: number | null }
 * // | { collection: "pages"; item: Page; sort: number | null }
 */
export type M2AConstructor<Map> = {
    [Key in keyof Map]: {
        collection: Key;
        item: Map[Key];
        sort: number | null;
    };
}[keyof Map];
