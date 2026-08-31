/**
 * Парсинг сырых query-параметры HTTP-запроса в объект,совместимый с Directus SDK `Query`.
 *
 * Предназначен для внутренних API-роутов приложения.
 *
 * Поддерживаемые параметры и форматы:
 *
 * | Параметр | Форматы данных         | Результат                       |
 * |----------|------------------------|---------------------------------|
 * | `fields` | CSV или JSON-массив    | `string[]` / объектный `fields` |
 * | `filter` | JSON-строка            | объект `Filter`                 |
 * | `sort`   | CSV или JSON-массив    | `string[]`                      |
 * | `limit`  | число                  | `number`                        |
 * | `offset` | число ≥ 0              | `number`                        |
 * | `page`   | число ≥ 1              | `number`                        |
 * | `search` | строка                 | `string`                        |
 * | `deep`   | JSON-строка            | объект deep-query               |
 *
 * Если один и тот же ключ приходит массивом (поведение h3/query), учитывается **первый** элемент.
 *
 * При невалидном JSON в `fields` / `filter` / `sort` / `deep` выбрасывается ошибка со статусом `400`.
 *
 * @param raw - Сырой объект из `getQuery(event)`
 * @returns Нормализованный объект `ICmsQuery` для передачи в SDK
 *
 * @throws { H3Error } status 400, если JSON в `fields`, `filter`, `sort` или `deep` невалиден
 *
 * @example
 * const query = parseCmsQuery(getQuery(event));
 * // query.fields, query.filter, query.limit, ...
 *
 * await directus.request(readItems(collection, query));
 */
export function parseCmsQuery(raw: Record<string, string | string[] | undefined>): ICmsQuery {
    const result: ICmsQuery = {};

    // fields
    // CSV: id,title,status
    // JSON: ["id","title",{"author":["name"]}]
    if (raw.fields !== undefined) {
        const value = Array.isArray(raw.fields) ? raw.fields[0] : raw.fields;
        if (typeof value === 'string' && value.trim()) {
            const trimmed = value.trim();

            if (trimmed.startsWith('[')) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        result.fields = parsed;
                    }
                } catch {
                    throw createError({
                        status: 400,
                        message: 'Invalid fields JSON',
                    });
                }
            } else {
                result.fields = trimmed
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
        }
    }

    // filter: JSON only
    // {"status":{"_eq":"published"}}
    if (raw.filter !== undefined) {
        const value = Array.isArray(raw.filter) ? raw.filter[0] : raw.filter;
        if (typeof value === 'string' && value.trim()) {
            try {
                result.filter = JSON.parse(value);
            } catch {
                throw createError({
                    status: 400,
                    message: 'Invalid filter JSON',
                });
            }
        }
    }

    // sort
    // CSV: -date_created,title
    // JSON: ["-date_created","title"]
    if (raw.sort !== undefined) {
        const value = Array.isArray(raw.sort) ? raw.sort[0] : raw.sort;
        if (typeof value === 'string' && value.trim()) {
            const trimmed = value.trim();

            if (trimmed.startsWith('[')) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        result.sort = parsed;
                    }
                } catch {
                    throw createError({ status: 400, message: 'Invalid sort JSON' });
                }
            } else {
                result.sort = trimmed
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
        }
    }

    // limit: любое число (включая -1 = "все")
    if (raw.limit !== undefined) {
        const value = Array.isArray(raw.limit) ? raw.limit[0] : raw.limit;
        const num = Number(value);
        if (!Number.isNaN(num)) {
            result.limit = num;
        }
    }

    // offset: ≥ 0 only
    if (raw.offset !== undefined) {
        const value = Array.isArray(raw.offset) ? raw.offset[0] : raw.offset;
        const num = Number(value);
        if (!Number.isNaN(num) && num >= 0) {
            result.offset = num;
        }
    }

    // page: ≥ 1 only
    if (raw.page !== undefined) {
        const value = Array.isArray(raw.page) ? raw.page[0] : raw.page;
        const num = Number(value);
        if (!Number.isNaN(num) && num >= 1) {
            result.page = num;
        }
    }

    // search: непустая строка
    if (raw.search !== undefined) {
        const value = Array.isArray(raw.search) ? raw.search[0] : raw.search;
        if (typeof value === 'string' && value.trim()) {
            result.search = value.trim();
        }
    }

    // deep: JSON only
    // {"translations":{"_filter":{"languages_code":{"_eq":"ru"}}}}
    if (raw.deep !== undefined) {
        const value = Array.isArray(raw.deep) ? raw.deep[0] : raw.deep;
        if (typeof value === 'string' && value.trim()) {
            try {
                result.deep = JSON.parse(value);
            } catch {
                throw createError({ status: 400, message: 'Invalid deep JSON' });
            }
        }
    }

    return result;
}
