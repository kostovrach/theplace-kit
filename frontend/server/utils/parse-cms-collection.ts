/**
 * Type guard: проверка, является ли строка именем **regular**-коллекции Directus.
 *
 * Используется runtime-словарь `regularCollections` (Set).
 * При успешном результате TypeScript сужает тип аргумента до `RegularCollectionType`.
 *
 * @param name - Строка для проверки (например, значение из URL или query)
 * @returns `name` is `RegularCollectionType`
 *
 * @example
 * const collection = getRouterParam(event, 'collection');
 *
 * if (isRegularCollection(collection)) {
 *   await directus.request(readItems(collection, query));
 * }
 */
export function isRegularCollection(name: string): name is RegularCollectionType {
    return regularCollections.has(name as RegularCollectionType);
}

/**
 * Type guard: проверка, является ли строка именем **singleton**-коллекции Directus.
 *
 * Используется runtime-словарь `singletonCollections` (Set).
 * При успешном результате TypeScript сужает тип аргумента до `SingletonCollectionType`.
 *
 * @param name - Строка для проверки (например, значение из URL или query)
 * @returns `name` is `SingletonCollectionType`
 *
 * @example
 * const collection = getRouterParam(event, 'collection');
 * 
 * if (isSingletonCollection(collection)) {
 *   await directus.request(readSingleton(collection, query));
 * }
 */
export function isSingletonCollection(name: string): name is SingletonCollectionType {
    return singletonCollections.has(name as SingletonCollectionType);
}

/**
 * Assertion-функция: утверждение, что значение является валидным именем коллекции(regular **или** singleton).
 *
 * После вызова TypeScript считает `name` типом `CollectionNameType`.
 * Если значение отсутствует или не найдено ни в одном словаре -
 * выбрасывает Nuxt/h3-ошибку с статусом `400`.
 *
 * @param name - Строка для проверки (например, значение из URL или query (может быть `undefined`))
 * @throws { H3Error } Если `name` пустой или неизвестен
 *
 * @example
 * const collection = getRouterParam(event, 'collection');
 * 
 * assertCollection(collection);
 * // После вызова collection приравнивается к CollectionNameType
 */
export function assertCollection(name: string | undefined): asserts name is CollectionNameType {
    if (!name || (!isRegularCollection(name) && !isSingletonCollection(name))) {
        throw createError({ status: 400, message: `Unknown collection: ${name ?? 'undefined'}` });
    }
}
