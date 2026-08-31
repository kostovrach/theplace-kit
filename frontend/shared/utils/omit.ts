/**
 * Удаление указанных ключей из объекта без мутации оригинала
 *
 * @template T Исходный тип объекта
 * @template K Ключи, которые нужно исключить
 *
 * @param obj Исходный объект
 * @param keys Массив ключей, которые нужно удалить
 *
 * @returns Новый объект типа Omit<T, K>
 *
 * @example
 * interface User {
 *   id: string;
 *   name: string;
 *   password: string;
 * }
 *
 * const user: User = {
 *   id: "1",
 *   name: "Иван Иванович",
 *   password: "secret",
 * };
 *
 * const safeUser = omit(user, ["password"]);
 *
 * // {
 * //   id: "1",
 * //   name: "Иван Иванович"
 * // }
 */
export function omit<T, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
    const result = { ...obj };

    for (const key of keys) {
        delete result[key];
    }

    return result as Omit<T, K>;
}
