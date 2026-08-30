/** Утверждение, что переданное значение является ключом `регулярной` коллекции Directus */
export function isRegularCollection(name: string): name is RegularCollectionType {
  return regularCollections.has(name as RegularCollectionType);
}

/** Утверждение, что переданное значение является ключом `singleton` коллекции Directus */
export function isSingletonCollection(name: string): name is SingletonCollectionType {
  return singletonCollections.has(name as SingletonCollectionType);
}

/** 
 * Утверждение, что переданное значение является ключом `регулярной` или `singleton` коллекции Directus.
 * В ином случае - `throw Error`
 */
export function assertCollection(name: string | undefined): asserts name is CollectionNameType {
  if (!name || (!isRegularCollection(name) && !isSingletonCollection(name))) {
    throw createError({ status: 400, message: `Unknown collection: ${name ?? 'undefined'}` });
  }
}