import type { Query } from '@directus/sdk';

/** Unified response format for CMS requests */
export interface ICmsResponse<T = unknown> {
    /** Успех операции */
    success: boolean;
    /** HTTP код ответа */
    status: number;
    /** Данные */
    data: T | null;
    /** Сообщение к ответу */
    message: string;
}

/**
 * Query-параметры для API-контракта.
 * Используется самый широкий допустимый вариант типа `Query` из `@directus/sdk`,
 * поскольку конкретная коллекция ещё не известна.
 */
export interface ICmsQuery {
    /**
     * Поля коллекции. Возможные форматы:
     * @example '?fields=id,title,status'
     * @example '?fields=["id","title",{"author":["name"]}]'
     */
    fields?: Query<Schema, Schema[keyof Schema]>['fields'] | readonly string[] | string[];
    /**
     * Фильтрация ответа. Всегда JSON-строка
     * @example '?filter={"status":{"_eq":"published"}}'
     */
    filter?: Query<Schema, Schema[keyof Schema]>['filter'];
    /**
     * Сортировка ответа, возможные форматы:
     * @example '?sort=-date_created,title'
     * @example '?sort=["-date_created","title"]'
     */
    sort?: Query<Schema, Schema[keyof Schema]>['sort'] | readonly string[] | string[];
    /**
     * Ограничение количества объектов для regular-коллекций:
     * - Положительное число
     * - `-1` для снятия ограничений
     */
    limit?: number;
    /**
     * Смещение начала ответа
     * - Положительное число
     */
    offset?: number;
    /**
     * Пагинация. Альтернатива `offset`. Формула рассчета: `offset = (page - 1) * limit`
     * - Если переданы `page` и `offset` - приоритет будет у `offset`
     */
    page?: number;
    /**
     * Глобальный поиск по всем текстовым полям коллекции / элементов коллекции
     * @example '?search="FooBar"'
     */
    search?: string;
    /**
     * Фильтрация для сложных связей и глубокой вложенности
     * @example '?deep={"translations":{"_filter":{"languages_code":{"_eq":"ru"}}}}'
     */
    deep?: Query<Schema, Schema[keyof Schema]>['deep'];
}
