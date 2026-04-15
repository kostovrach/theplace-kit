# Theplace-kit <br> API Route: `/api/cms/[collection]`

Серверный cached handler Nuxt для получения данных из Directus CMS.  
Работает как универсальный API-прокси для всех коллекций.

---

## Назначение

Роут используется для:

- получения коллекций из CMS
- унифицированного доступа к Directus данным
- обработки query-параметров
- SSR-кэширования ответов

---

## Обработка запроса

### 1. Query параметры

Поддерживаются:

- `fields`
- `relations`
- `filter`
- `sort`
- `limit`

Форматы:

- CSV: `a,b,c`
- JSON массив: `["a","b"]` (для fields)
- JSON объект: `filter`

---

### 2. collection

Если отсутствует:

- HTTP 400
- ответ:
  `{ "data": null, "error": "collection is required" }`

---

### 3. fields

Поддерживает:

- строку CSV
- JSON массив

---

### 4. relations

CSV строка:
`author.*,images.*,category.*`

---

### 5. filter

JSON строка > объект  
При ошибке > `400 invalid filter JSON`

---

### 6. sort

Строка без преобразований:
`-date`

---

### 7. limit

Число:
`Number(q.limit)`

---

## Формирование запроса

```
params:
{
  fields: fields ?? ['*', ...(relations ?? [])],
  filter,
  sort,
  limit
}
```

---

## Получение данных

`fetchCollection(collection, params, opts)`

---

## Ошибки

### 400

- отсутствует collection
- invalid filter JSON

Формат:
`{ data: null, error: "message" }`

---

### 500

Любая внутренняя ошибка сервера или Directus

---

## Ответ

### success

```
`{ data: [...] }`
```

### error

```
{ data: null, error: "..." }
```

---

## Особенности

- универсальный CMS endpoint
- система query параметров
- совместим с useCms / useCmsItem
- безопасный JSON parsing
- auto-merge fields + relations

---

## Пример запроса

```
/api/cms/articles?fields=title,slug&relations=author&limit=10&sort=-date
```

---

## Пример ответа

```
{
  "data": [
    {
      "title": "Article",
      "slug": "article"
    }
  ]
}
```
