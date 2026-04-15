# Theplace-kit <br> API Route: `/api/cms/[collection]/[id]`

Серверный cached handler Nuxt для получения одной записи из Directus CMS по `collection` и `id`.

Используется как универсальный endpoint для item-данных с SSR-кэшированием.

---

## Назначение

Роут предназначен для:

- получения одной записи из CMS
- работы с детальными страницами (article, page, product и т.д.)
- унифицированного доступа к Directus item API
- SSR caching

---

## Параметры маршрута

### Обязательные

- `collection`
- `id`

Если отсутствуют:

- `HTTP 400`
- ответ:

```
{ data: null, error: "collection and id are required" }
```

---

## Query параметры

Поддерживаются:

- `fields`
- `relations`
- `resolveFiles`
- `force`

---

## fields

Форматы:

- CSV: `title.*,slug.*,content.*`
- JSON массив: `["title","slug"]`

Если не передан:
используется `['*', ...relations]`

---

## relations

CSV строка:
`author.*,images.*,category.*`

---

## resolveFiles

- `true` по умолчанию
- `false` только если `resolveFiles=false`

---

## force

true если:

- `force=1`
- `force=true`

---

## Формирование запроса

```
params:
{
  fields: fields ?? ['*', ...(relations ?? [])]
}
```

```
options:
{
  resolveFiles,
  force
}
```

---

## Fetch

`fetchItem(collection, id, params, options)`

---

## Кэширование

- maxAge: 300 секунд (5 минут)
- cached handler Nuxt

Кэш зависит от:

- `collection`
- `id`
- query params

---

## Ошибки

### 400

- отсутствует `collection`
- отсутствует `id`

Ответ:

```
{ data: null, error: "collection and id are required" }
```

---

### 500

Любая ошибка сервиса

Ответ:

```
{ data: null, error: "message" }
```

---

## Ответ

### success

```
{ data: { ... } }
```

### error

```
{ data: null, error: "..." }
```

---

## Особенности

- единый CMS endpoint для item
- SSR caching
- гибкие fields + relations
- совместим с useCmsItem
- минимальная трансформация данных
- безопасный parsing query string

---

## Пример запроса

```
/api/cms/articles/123?fields=title,slug&relations=author
```

---

## Пример ответа

```
{ data: { title: "Article", slug: "article" } }
```
