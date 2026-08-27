---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
    text: ThePlace-kit
    tagline: <br>Библиотека компонентов и архитектурных решений на базе Nuxt и Directus.
    image:
        src: /logo.svg
        alt: logo
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
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0eb46f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench-icon lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg>'
      details: Используется как fullstack-фреймворк с серверными API-роутами.
    - title: Directus
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0eb46f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folders-icon lucide-folders"><path d="M20 5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5a1.5 1.5 0 0 1 1.2.6l.6.8a1.5 1.5 0 0 0 1.2.6z"/><path d="M3 8.268a2 2 0 0 0-1 1.738V19a2 2 0 0 0 2 2h11a2 2 0 0 0 1.732-1"/></svg>'
      details: Как контентный backend и админ-панель.
    - title: PostgreSQL + PostGIS
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0eb46f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database-icon lucide-database"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>'
      details: Основное хранилище данных CMS.
    - title: Паттерн server-proxy
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0eb46f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-signpost-icon lucide-signpost"><path d="M12 13v8"/><path d="M12 3v3"/><path d="M2.354 10.354a1.207 1.207 0 0 1 0-1.708l2.06-2.06A2 2 0 0 1 5.828 6h12.344a2 2 0 0 1 1.414.586l2.06 2.06a1.207 1.207 0 0 1 0 1.708l-2.06 2.06a2 2 0 0 1-1.414.586H5.828a2 2 0 0 1-1.414-.586z"/></svg>'
      details: Frontend работает не напрямую с CMS, а через внутренний API-слой.
    - title: Единый data-access layer
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0eb46f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers2-icon lucide-layers-2"><path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z"/><path d="m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845"/></svg>'
      details: Единая точка доступа к CMS-данным на клиенте/SSR с типизацией.
    - title: Docker / Docker Compose
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0eb46f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-container-icon lucide-container"><path d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"/><path d="M10 21.9V14L2.1 9.1"/><path d="m10 14 11.9-6.9"/><path d="M14 19.8v-8.1"/><path d="M18 17.5V9.4"/></svg>'
      details: Локальная и серверная оркестрация сервисов.
    - title: PWA
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0eb46f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-blocks-icon lucide-blocks"><path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2"/><rect x="14" y="2" width="8" height="8" rx="1"/></svg>'
      details: Расширяемый слой конфига для быстрой перестройки приложения под PWA.
    - title: Makefile
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0eb46f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-text-icon lucide-square-text"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h8"/><path d="M7 12h10"/><path d="M7 16h6"/></svg>'
      details: Набор скриптов для упревления проектом в production среде.
---

<div class="tech-container">
  <h2 class="tech-title">Инструменты и технологии</h2>
  
  <div class="tech-grid">
    <a href="https://typescriptlang.org" target="_blank" class="tech-card">
      <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" />
      <span class="tech-label">TypeScript</span>
    </a>
    <a href="https://vuejs.org" target="_blank" class="tech-card">
      <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" />
      <span class="tech-label">Vue.js</span>
    </a>
    <a href="https://nuxt.com/" target="_blank" class="tech-card">
        <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxt/nuxt-original.svg" />
      <span class="tech-label">Nuxt</span>
    </a>
    <a href="https://pinia.vuejs.org/" target="_blank" class="tech-card">
      <span class="tech-image" style="display: flex; align-items: center; justify-content: center">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="40" viewBox="0 0 319 477" ><linearGradient id="a"><stop offset="0" stop-color="#52ce63"/><stop offset="1" stop-color="#51a256"/></linearGradient><linearGradient id="b" x1="55.342075%" x2="42.816933%" xlink:href="#a" y1="0%" y2="42.862855%"/><linearGradient id="c" x1="55.348642%" x2="42.808103%" xlink:href="#a" y1="0%" y2="42.862855%"/><linearGradient id="d" x1="50%" x2="50%" y1="0%" y2="58.811243%"><stop offset="0" stop-color="#8ae99c"/><stop offset="1" stop-color="#52ce63"/></linearGradient><linearGradient id="e" x1="51.37763%" x2="44.584719%" y1="17.472551%" y2="100%"><stop offset="0" stop-color="#ffe56c"/><stop offset="1" stop-color="#ffc63a"/></linearGradient><g fill="none" fill-rule="evenodd" transform="translate(-34 -24)"><g transform="matrix(.99254615 .12186934 -.12186934 .99254615 33.922073 .976691)"><path d="m103.950535 258.274149c44.361599-4.360825 60.014503-40.391282 65.353094-94.699444s-30.93219-103.451001-46.020347-101.9678079c-15.088156 1.4831932-63.0385313 58.9051239-68.3771222 113.2132869-5.3385908 54.308162 4.6827754 87.814791 49.0443752 83.453965z" fill="url(#b)" transform="matrix(.70710678 -.70710678 .70710678 .70710678 -80.496332 125.892944)"/><path d="m275.876752 258.273992c44.3616 4.360826 53.167133-29.265322 47.828542-83.573485-5.338591-54.308162-52.073133-111.6105744-67.16129-113.0937675-15.088156-1.4831931-52.57477 47.5401275-47.236179 101.8482895s22.207328 90.458137 66.568927 94.818963z" fill="url(#c)" transform="matrix(.70710678 .70710678 -.70710678 .70710678 191.403399 -141.861963)"/><path d="m188.370027 216.876305c39.941834 0 50.95265-38.251987 50.95265-97.89874 0-59.6467532-37.367733-118.10125956-50.95265-118.10125956s-52.04735 58.45450636-52.04735 118.10125956c0 59.646753 12.105516 97.89874 52.04735 97.89874z" fill="url(#d)"/></g><path d="m184.473473 501c83.118854 0 150.526527-24.145148 150.526527-133.645148s-67.407673-199.354852-150.526527-199.354852c-83.118855 0-150.473473 89.854852-150.473473 199.354852s67.354618 133.645148 150.473473 133.645148z" fill="url(#e)"/><ellipse cx="260.5" cy="335" fill="#eaadcc" rx="21.5" ry="10"/><ellipse cx="102.5" cy="329" fill="#eaadcc" rx="21.5" ry="10" transform="matrix(.99254615 .12186934 -.12186934 .99254615 40.859033 -10.039292)"/><g transform="matrix(-.99939083 .0348995 .0348995 .99939083 269.284825 271.027667)"><path d="m73.1046985 58.2728794c6.7372416 4.9130333 14.3132632 6.6640587 22.7280649 5.2530761 8.4148016-1.4109825 14.5054466-5.2535769 18.2719346-11.527783" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="6" transform="matrix(.9998477 .01745241 -.01745241 .9998477 1.026464 -1.624794)"/><path d="m154.501124 3c-5.937545 0-11.312782 2.40629805-15.203644 6.29680621-3.89094 3.89058529-6.29748 9.26545449-6.29748 15.20263179 0 5.9376888 2.406488 11.3127422 6.297291 15.2034272 3.890886 3.8907673 9.266197 6.2971348 15.203833 6.2971348 5.937109 0 11.311896-2.4063889 15.202387-6.2972348 3.890299-3.8906535 6.296489-9.2656636 6.296489-15.2033272 0-5.9371521-2.406242-11.3119781-6.296677-15.20253181-3.890469-3.89058674-9.265181-6.29690619-15.202199-6.29690619z" fill="#000"/><path d="m154 21c0-3.865549 3.135362-7 6.999413-7 3.866399 0 7.000587 3.134451 7.000587 7s-3.134188 7-7.000587 7c-3.864051-.0011735-6.999413-3.134451-6.999413-7z" fill="#fff"/><path d="m24.5 13c-5.9375292 0-11.312426 2.406268-15.20299427 6.2967181-3.89069464 3.8905765-6.29700573 9.2654765-6.29700573 15.2027199 0 5.9377549 2.40625962 11.3128391 6.29681766 15.2035153 3.89059104 3.8907092 9.26556184 6.2970467 15.20318234 6.2970467 5.9371249 0 11.3122514-2.406419 15.2030371-6.2973229 3.8905441-3.8906623 6.2969629-9.2656416 6.2969629-15.2032391 0-5.937086-2.4064703-11.3118811-6.297151-15.2024437-3.890763-3.8906448-9.2658154-6.2969943-15.202849-6.2969943z" fill="#000"/><g fill="#fff"><path d="m136 24.499438c0 10.2185232 8.282911 18.500562 18.501124 18.500562 10.217089 0 18.498876-8.2820388 18.498876-18.500562 0-10.2173992-8.281787-18.499438-18.498876-18.499438-10.218213 0-18.501124 8.2820388-18.501124 18.499438zm-6 0c0-13.5311954 10.96929-24.499438 24.501124-24.499438 13.530838 0 24.498876 10.9683711 24.498876 24.499438 0 13.5319607-10.967808 24.500562-24.498876 24.500562-13.532064 0-24.501124-10.9684728-24.501124-24.500562z" fill-rule="nonzero" stroke="#fff" stroke-width="3"/><path d="m6 34.499438c0 10.2185232 8.2817873 18.500562 18.5 18.500562 10.2170889 0 18.5-8.2820388 18.5-18.500562 0-10.2173992-8.2829111-18.499438-18.5-18.499438-10.2182127 0-18.5 8.2820388-18.5 18.499438zm-6 0c0-13.531297 10.9682681-24.499438 24.5-24.499438 13.5309398 0 24.5 10.9684728 24.5 24.499438 0 13.5318591-10.96883 24.500562-24.5 24.500562-13.531962 0-24.5-10.9683711-24.5-24.500562z" fill-rule="nonzero" stroke="#fff" stroke-width="3"/><path d="m24 31c0-3.865549 3.134451-7 7-7s7 3.134451 7 7-3.134451 7-7 7-7-3.134451-7-7z"/></g></g><g stroke-linecap="round" stroke-width="11"><g stroke="#ecb732"><path d="m70.5 377.5 74 77"/><path d="m134.5 386.5-47 50"/></g><g stroke="#ecb732" transform="matrix(-1 0 0 1 298 377)"><path d="m.5.5 74 77"/><path d="m64.5 9.5-47 50"/></g><g stroke="#ffc73b" transform="matrix(0 1 -1 0 215 207)"><path d="m.5.5 49 49"/><path d="m.5 10.5 49 49" transform="matrix(-1 0 0 1 50 0)"/></g></g></g></svg>
      </span>
      <span class="tech-label">Pinia</span>
    </a>
    <a href="https://directus.com" target="_blank" class="tech-card">
      <span class="tech-image" style="display: flex; align-items: center; justify-content: center">
        <svg role="img" width="42" height="42" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19.187 13.909a1.74 1.74 0 0 1-.286-.092.657.657 0 0 1-.203-.139c.056-.488 0-.912.047-1.392.184-1.862 1.355-1.272 2.406-1.577.655-.184 1.31-.562 1.475-1.336a13.528 13.528 0 0 0-2.397-2.204c-2.85-2.028-6.574-2.84-9.958-2.277a5.113 5.113 0 0 0 2.238 2.074s-.917 0-1.703-.587c-.23.092-.692.274-.913.384a5.094 5.094 0 0 0 6.63.37c-.01.017-.185.285-.397 1.4-.47 2.38-1.826 2.195-3.504 1.596-3.485-1.264-5.403-.093-7.145-2.49-.507.286-.82.82-.82 1.402 0 .599.331 1.106.81 1.383.262-.348.38-.446.836-.446-.706.4-.79.75-1.094 1.718-.368 1.171-.212 2.37-1.936 2.683-.913.046-.894.664-1.226 1.586-.415 1.199-.968 1.678-2.047 2.812.443.535.904.6 1.374.406.968-.406 1.715-1.66 2.415-2.471.784-.904 2.665-.517 4.085-1.402.977-.599 1.457-1.41.811-2.784a2.72 2.72 0 0 1 .701 1.66c1.641-.213 3.836 1.788 5.836 2.12a3.574 3.574 0 0 1-.488-.82c-.23-.554-.304-1.06-.258-1.503.184 1.097 1.29 2.507 3.07 2.637.452.036.95-.019 1.466-.176.618-.184 1.19-.424 1.872-.295.507.093.977.35 1.272.784.443.645 1.41.784 1.844-.009-.977-2.554-3.67-2.72-4.813-3.015z"/></svg>
      </span>
      <span class="tech-label">Directus</span>
    </a>
    <a href="https://www.postgresql.org/" target="_blank" class="tech-card">
        <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" />
      <span class="tech-label">PostgreSQL</span>
    </a>
    <a href="https://www.docker.com/" target="_blank" class="tech-card">
        <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg" />
      <span class="tech-label">Docker</span>
    </a>
    <a href="https://nginx.org/" target="_blank" class="tech-card">
        <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg" />
      <span class="tech-label">Nginx</span>
    </a>
    <a href="https://pm2.keymetrics.io/" target="_blank" class="tech-card">
        <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pm2/pm2-original.svg" />
      <span class="tech-label">PM2</span>
    </a>
    <a href="https://pnpm.io/" target="_blank" class="tech-card">
        <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pnpm/pnpm-original.svg" />
      <span class="tech-label">pnpm</span>
    </a>
    <a href="https://sass-lang.com/" target="_blank" class="tech-card">
        <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg" />
      <span class="tech-label">SCSS</span>
    </a>
    <a href="https://nodejs.org" target="_blank" class="tech-card">
        <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" />
      <span class="tech-label">Node.js</span>
    </a>
    <a href="https://vite.dev/" target="_blank" class="tech-card">
      <img class="tech-image" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" />
      <span class="tech-label">Vite</span>
    </a>
  </div>
</div>

<style scoped>
.tech-container {
  margin: 64px auto;
  text-align: center;
}
.tech-title {
  font-size: 32px;
  font-weight: 600;
  padding-top: 64px;
}
.tech-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}
.tech-card {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  padding: 8px 32px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: border-color 0.25s, background-color 0.25s;
}
.tech-card:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
.tech-image {
  display: block;
  height: 68px;
  margin: 0;
  aspect-ratio: 1;
  padding: 12px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid transparent;
  border-radius: 8px;
  
}
.tech-image:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
.tech-label {
  font-size: 14px;
}
</style>
