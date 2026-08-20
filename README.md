# Theplace-kit

`Theplace-kit` — внутренний шаблон для быстрого старта новых проектов на базе `Nuxt` и `Directus`.  
Содержит готовые архитектурные решения, API-слой, набор переиспользуемых компонентов, утилиты и инфраструктурную документацию.

Проект в первую очередь ориентирован на разработчиков команды, но распространяется как open-source.

## Стек

- `Nuxt` (SSR)  
  Основной frontend-слой. Используется как fullstack-фреймворк с серверными API-роутами в `server/api`.

- `Directus` (Headless CMS)  
  Контентный backend и админ-панель. Доступ к данным организован через проксирующие Nuxt API-эндпоинты `/api/cms/*` на базе `directus/sdk`.

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

- `pnpm` — пакетный менеджер.

## Карта документации

Основная документация находится в `docs/`.

### Инфраструктура

- [Docker-образ Directus](./docs/infrastructure/directus.md)
- [Docker compose](./docs/infrastructure/docker-compose.md)
- [Makefile для управления деплоем](./docs/infrastructure/makefile.md)
- [Настройка pm2 для фронтенда](./docs/infrastructure/pm2-ecosystem.md)
- [Перестройка проекта под PWA](./docs/pwa.md)

---

### Деплой

- [Настройка VPS](./docs/deploy/vps.md)
- [Развертывание Docker](./docs/deploy/docker.md)
- [Сборка фронтенда](./docs/deploy/frontend.md)
- [Настройка nginx](./docs/deploy/nginx.md)

---

### Шаблоны компонентов

- [ButtonPrimary](./docs/components/ButtonPrimary.md)
- [Embla](./docs/components/Embla.md)
- [FormNotify](./docs/components/FormNotify.md)
- [Glass](./docs/components/Glass.md)
- [Lightbox](./docs/components/Lightbox.md)
- [MapWrapper](./docs/components/MapWrapper.md)
- [ModalsDocs](./docs/components/ModalsDocs.md)
- [SvgSprite](./docs/components/SvgSprite.md)
  <br />
  ...

---

### Composables

- [useCms](./docs/composables/useCms.md)
- [useCmsItem](./docs/composables/useCmsItem.md)
- [useClock](./docs/composables/useClock.md)

---

### Server API

- [[collection].get.ts](./docs/server/api/%5Bcollection%5D.get.ts.md)
- [[collection][id].get.ts](./docs/server/api/%5Bcollection%5D%5Bid%5D.get.ts.md)

---

### Типы

- [IDirectusFile](./docs/types/IDirectusFile.md)
- [ISeoSettings](./docs/types/ISeoSettings.md)
- [M2AConstructor](./docs/types/m2a-constructor.md)
  <br />
  ...

---

### Utils

- [logger](./docs/utils/logger.md)
- [slugify](./docs/utils/slugify.md)
- [omit](./docs/utils/omit.md)
- [pick](./docs/utils/pick.md)
  <br />
  <br />
- [expandAssetPath](./docs/utils/expandAssetPath.md)
- [isChromium](./docs/utils/isChromium.md)
- [partialHiddenPhone](./docs/utils/partialHiddenPhone.md)
  <br />
  <br />
- [normalizeDate](./docs/utils/normalizeDate.md)
- [normalizeFileSize](./docs/utils/normalizeFileSize.md)
- [normalizePhone](./docs/utils/normalizePhone.md)
- [normalizeUrl](./docs/utils/normalizeUrl.md)

---

### Конвенции

- [Code-style](./docs/code-style.md)
