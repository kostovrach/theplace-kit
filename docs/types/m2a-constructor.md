# M2AConstructor

Утилитарный тип для работы с Many-to-Any (полиморфными) связями в Directus.

## Назначение

Позволяет типизировать матричные/полиморфные отношения (M2A), где один элемент может ссылаться на объекты из разных коллекций. Используется для создания конструкторов статей или т.п.

## Описание

Преобразует объект-карту коллекций в union-тип, где каждый вариант содержит:

- `collection` — имя коллекции
- `item` — тип данных этой коллекции
- `sort` — порядок сортировки

## Generic

| Параметр | Описание                                                  |
| -------- | --------------------------------------------------------- |
| `Map`    | Объект, где ключ = имя коллекции, значение = тип элемента |

## Пример использования

```ts
type ContentMap = {
	articles: Article;
	pages: Page;
	banners: Banner;
};

type ContentBlock = M2AConstructor<ContentMap>;

// Результат типа:
type ContentBlock = { collection: 'articles'; item: Article; sort: number | null } | { collection: 'pages'; item: Page; sort: number | null } | { collection: 'banners'; item: Banner; sort: number | null };
```
