# Theplace-kit <br> ExpandAssetPath

Утилита для формирования полного URL к файлам из библиотеки Directus.

## Назначение

Преобразует объект файла из Directus в полноценную ссылку на asset с автоматической оптимизацией (WebP для изображений) и поддержкой дополнительных query-параметров.

## Функционал

- Возвращает абсолютный URL: `<cmsUrl>/assets/<filename_disk>`
- Автоматически добавляет `?format=webp` для изображений (кроме SVG)
- Поддерживает дополнительные query-параметры (например, `width`, `height`, `quality`)
- Использует `filename_disk` вместо `id` для лучшей совместимости с лайтбоксами и внешними библиотеками
- Получает `cmsUrl` из `useRuntimeConfig().public.cmsUrl`

## Аргументы

| Параметр | Тип                   | По умолчанию | Описание                                                           |
| -------- | --------------------- | ------------ | ------------------------------------------------------------------ |
| `file`   | `IDirectusFile`       | —            | Объект файла из Directus                                           |
| `query`  | `string \| undefined` | `undefined`  | Дополнительные параметры запроса (например `width=800&quality=80`) |

## Возвращаемое значение

| Тип      | Описание                       |
| -------- | ------------------------------ |
| `string` | Полный URL до файла в Directus |

## Пример использования

```ts
const article = await useCmsItem('articles', id);

// Простое изображение
const imageUrl = expandAssetPath(article.image);
// -> https://cms.<домен>.ru/assets/abc123.jpg?format=webp

// С дополнительными параметрами
const thumbUrl = expandAssetPath(image.image, 'width=600&quality=90');
// -> https://cms.<домен>.ru/assets/abc123.jpg?format=webp&width=600&quality=90
```
