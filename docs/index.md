---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
    name: ThePlace-kit
    text: Шаблон для старта проектов
    tagline: Библиотека компонентов и архитектурных решений на базе Nuxt и Directus.
    image:
      src: /logo.svg
      alt: Логотип проекта
    actions:
        - theme: brand
          text: Документация
          link: /guide
        - theme: alt
          text: GitHub
          link: https://github.com/kostovrach/theplace-kit
          target: _blank

features:
    - title: На базе Nuxt
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA3546" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench-icon lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg>'
      details: Используется как fullstack-фреймворк с серверными API-роутами.
    - title: Directus
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA3546" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folders-icon lucide-folders"><path d="M20 5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5a1.5 1.5 0 0 1 1.2.6l.6.8a1.5 1.5 0 0 0 1.2.6z"/><path d="M3 8.268a2 2 0 0 0-1 1.738V19a2 2 0 0 0 2 2h11a2 2 0 0 0 1.732-1"/></svg>'
      details: Как контентный backend и админ-панель.
    - title: PostgreSQL + PostGIS
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA3546" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database-icon lucide-database"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>'
      details: Основное хранилище данных CMS.
    - title: Паттерн server-proxy
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA3546" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-signpost-icon lucide-signpost"><path d="M12 13v8"/><path d="M12 3v3"/><path d="M2.354 10.354a1.207 1.207 0 0 1 0-1.708l2.06-2.06A2 2 0 0 1 5.828 6h12.344a2 2 0 0 1 1.414.586l2.06 2.06a1.207 1.207 0 0 1 0 1.708l-2.06 2.06a2 2 0 0 1-1.414.586H5.828a2 2 0 0 1-1.414-.586z"/></svg>'
      details: Frontend работает не напрямую с CMS, а через внутренний API-слой.
    - title: Единый data-access layer
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA3546" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers2-icon lucide-layers-2"><path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z"/><path d="m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845"/></svg>'
      details: Единая точка доступа к CMS-данным на клиенте/SSR с типизацией.
    - title: Docker / Docker Compose
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA3546" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-container-icon lucide-container"><path d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"/><path d="M10 21.9V14L2.1 9.1"/><path d="m10 14 11.9-6.9"/><path d="M14 19.8v-8.1"/><path d="M18 17.5V9.4"/></svg>'
      details: Локальная и серверная оркестрация сервисов.
    - title: PWA
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA3546" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-blocks-icon lucide-blocks"><path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2"/><rect x="14" y="2" width="8" height="8" rx="1"/></svg>'
      details: Расширяемый слой конфига для быстрой перестройки приложения под PWA.
    - title: Makefile
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA3546" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-text-icon lucide-square-text"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h8"/><path d="M7 12h10"/><path d="M7 16h6"/></svg>'
      details: Набор скриптов для упревления проектом в production среде.
---
