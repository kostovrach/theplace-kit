# Theplace-kit

`Theplace-kit` — шаблон для быстрого старта новых проектов на базе `Nuxt` и `Directus` с готовыми базовыми архитектурными решениями, API-слоем, набором прикладных компонентов и инфраструктурной документацией.

Проект ориентирован в первую очередь на внутренних разработчиков команды, но может использоваться и как внешняя стартовая база.

## Стек

- `Nuxt` (SSR)  
  Основной frontend-слой. Используется как fullstack-фреймворк с серверными API-роутами в `server/api`.

- `Directus` (Headless CMS)  
  Контентный backend и админ-панель. Доступ к данным организован через проксирующие Nuxt API-эндпоинты `/api/cms/*`.

- `PostgreSQL` + `PostGIS`  
  Основное хранилище данных CMS. `PostGIS` подключается как расширение для пространственных данных.

- `Nuxt Server API` + Cached Handlers` 
  Паттерн server-proxy: frontend работает не напрямую с CMS, а через внутренний API-слой с единым форматом ответов и кэшированием.

- `Composables` для централизации связи frontend и cms  
  Паттерн data-access layer: единая точка доступа к CMS-данным на клиенте/SSR с типизацией, query-конфигом и переиспользованием кэша.

- `Docker` / `Docker Compose`  
  Локальная и серверная оркестрация сервисов (`Directus`, `PostgreSQL` и сопутствующая инфраструктура).

- `Nginx`  
  Reverse proxy для frontend и CMS, маршрутизация доменов и раздача статики.

- `PM2`  
  Процесс-менеджер для запуска Nuxt production-сервера и автоподнятия после рестартов.

- `PWA` (`@vite-pwa/nuxt`)  
  Паттерн расширяемого слоя (`layers/pwa`): отдельный конфиг для service worker, runtime caching и web-app manifest.

## Карта документации

Основная документация находится в `docs/`.

### Инфраструктура

- [Деплой и миграция проекта](./docs/deploy.md)
- [Перестройка проекта под PWA](./docs/pwa.md)

### Шаблоны компонентов

- [ButtonPrimary](./docs/components/ButtonPrimary.md)
- [Embla](./docs/components/Embla.md)
- [FormNotify](./docs/components/FormNotify.md)
- [Galss](./docs/components/Galss.md)
- [Lightbox](./docs/components/Lightbox.md)
- [MapWrapper](./docs/components/MapWrapper.md)
- [ModalsDocs](./docs/components/ModalsDocs.md)
- [SvgSprite](./docs/components/SvgSprite.md)

### Composables

- [useCms](./docs/composables/useCms.md)
- [useCmsItem](./docs/composables/useCmsItem.md)

### Server API

- [[collection].get.ts](./docs/server/api/%5Bcollection%5D.get.ts.md)
- [[collection][id].get.ts](./docs/server/api/%5Bcollection%5D%5Bid%5D.get.ts.md)

### Utils

- [slugify](./docs/utils/slugify.md)
