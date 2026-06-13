# Theplace-kit <br> ISeoSettings

Интерфейс для SEO-настроек страниц и сущностей в проекте.

## Назначение

Стандартизирует структуру SEO-полей, которые хранятся в Directus и используются на всех страницах и типах контента. Обеспечивает единый подход к мета-тегам, Open Graph и индексации.

## Поля интерфейса

| Поле               | Тип                                      | Описание                                      |
| ------------------ | ---------------------------------------- | --------------------------------------------- |
| `meta_title`       | `string`                                 | Заголовок страницы для `<title>` и `og:title` |
| `meta_description` | `string \| null`                         | Описание страницы для `meta description` и `og:description` |
| `meta_robots`      | `'index, follow' \| 'noindex, nofollow'` | Директива для поисковых роботов              |
| `meta_keywords`    | `string[]`                               | Массив ключевых слов (meta keywords)          |
| `og_image`         | `IDirectusFile \| null`                  | Изображение для Open Graph (`og:image`)       |

## Пример использования

```ts
interface IPage extends ISeoSettings {
    // ... контент
}

const { content } = await useCms<IPage>('home_page');

useHead({
  title: seo.meta_title,
  meta: [
    { name: 'description', content: seo.meta_description },
    { name: 'robots', content: seo.meta_robots },
    { name: 'keywords', content: seo.meta_keywords.join(', ') },
    { property: 'og:image', content: seo.og_image ? expandAssetPath(seo.og_image) : undefined },
  ],
});
```