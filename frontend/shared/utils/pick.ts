/**
 * Выбор указанных ключей из объекта без мутации оригинала
 *
 * @template T Исходный тип объекта
 * @template K Ключи, которые нужно выбрать из объекта
 *
 * @param obj Исходный объект
 * @param keys Массив ключей, которые нужно оставить
 *
 * @returns Новый объект типа Pick<T, K>
 *
 * @example
 * interface User {
 *   id: string;
 *   name: string;
 *   age: number;
 * }
 *
 * const user: User = {
 *   id: "1",
 *   name: "Иван Иванович",
 *   age: 30,
 * };
 *
 * const shortUser = pick(user, ["id", "name"]);
 *
 * // {
 * //   id: "1",
 * //   name: "Иван Иванович"
 * // }
 */
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;

    for (const key of keys) {
        result[key] = obj[key];
    }

    return result;
}
