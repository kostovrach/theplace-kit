# Перестройка проекта под PWA

## Установка зависимостей

Установка Nuxt модуля

```bash
npx nuxi@latest module add @vite-pwa/nuxt
```

или ручная установка с последующей регистрацией модуля в корневом `nuxt.config.ts` (дальше будет понятно, почему я назвал его корневым)

```bash
pnpm add @vite-pwa/nuxt
```

```typescript
// frontend/nuxt.config.ts
export default defineNuxtConfig({
	// <...>
	modules: [
		// <...>
		'@vite-pwa/nuxt',
	],
	// <...>
});
```

## Конфиг

Чтобы не захламлять основной `nuxt.config.ts` рекомендую создать отдельный слой под PWA - `frontend/layers/pwa/nuxt.config.ts`. Поскольку конфигурация pwa довольно обширная (за счет подключение большого количества иконок) разделение конфигов сильно упрощает дальнейшую поддержку проекта.
<br>
В конце будет полный пример конфига с описанием каждого свойства

```typescript
// frontend/layers/pwa/nuxt.config.ts

export default defineNuxtConfig({
	pwa: {
		devOptions: {
			enabled: false,
			type: 'module',
		},

		registerType: 'autoUpdate',
		injectRegister: 'auto',

		manifest: {
			name: 'Полное название проекта',
			short_name: 'Короткое название проекта',
			display: 'standalone',
			background_color: '#FFFFFF',
			theme_color: '#000000',
			start_url: '/',
			scope: '/',
			icons: [
				{ src: '...', sizes: '...', type: '...' },
				// <...>
			],
		},

		workbox: {
			cleanupOutdatedCaches: true,
			clientsClaim: true,
			skipWaiting: true,

			navigateFallback: '/offline.html',
			globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest}'],

			runtimeCaching: [
				{
					urlPattern: /^\/_nuxt\/.*/i,
					handler: 'CacheFirst',
					options: {
						cacheName: 'nuxt-assets',
						expiration: {
							maxEntries: 200,
						},
					},
				},
				{
					urlPattern: /^\/api\/cms\/assets\/.*/i,
					handler: 'CacheFirst',
					options: {
						cacheName: 'cms-assets',
						expiration: {
							maxEntries: 300,
						},
					},
				},
			],
		},
	},
});
```

### Манифест

Ключ `manifest` тут отвечает за web-манифест приложения, который отражает основную информацию:

- `name`: полное название приложения для сторов;
- `short_name`: короткое название проекта, которое отображается под иконкой устакновленного приложения;
- `display`: как приложение будет отображаться на устройствах. Самый распространенный вариант это `standalone`, в такой конфигурации скрываются все атрибуты браузера (строка запроса и т.д.). Еще варианты: `fullscreen`, `minimal-ui`, `browser`;
- `background_color`: фоновый цвет приложения (по аналогии с `<meta name="theme-color" />` в браузерах);
- `theme_color`: основной цвет приложения;
- `start_url` и `scope`: корень приложения;
- `icons`: массов иконок для разных типов устройств;

### Service Worker

Это воркер приложения, который отвечает за всю подкопотную логику приложения. В нашем случае он интересен как механизм кэширования.

- `navigateFallback`: ссылка на то, что сайт должен показывать пользователю при отсуствии сетевого подключения. Оптимальная практика - это статичный файл `offline.html` в папке `frontend/public`. Файл должен быть полностью самодостаточен, то есть не делать никаких сетевых запросов, иметь все стили, иконки и картинки в инлайне (ну или нужно заранее позаботиться чтобы все связанные с ним файлы тоже были заранее закэшированы);
- `globPatterns`: все файлы, которые должны подвергаться кэшированию при старте приложения (в т.ч. файл `offline.html`);
- `runtimeCaching`: отвечает за кэширование динамического контента с api. В примере конфига указаны два паттерна, которые кэшируют статические файлы nuxt (css и js бандлы) и все ассеты, пришедшие по api с directus;
- `runtimeCaching.handler`: значение `CacheFirst` укзывает на то, что при запросе этих файлов сначала нужно искать их в кэше и если в кэше их не оказалось - делать сетевой запрос и кэшировать. Еще варианты: `CacheOnly`, `NetworkFirst`, `NetworkOnly`, `StaleWhileRevalidate`;
- `runtimeCaching.handler.options.cacheName`: уникальный ключ именно для этого паттерна;
- `runtimeCaching.handler.options.expiration.maxEntries`: время жизни кэша;

## Подключение к основному конфигу

Полсе написания конфига под pwa нужно подключить его к корневому `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
	extends: ['./layers/pwa'],
	// <...>
});
```

В файле `frontend/app/app.vue` нужно зарегистрировать компонент с манифестом:

```vue
<template>
	<NuxtPage />
	<!-- ... -->
	<NuxtPwaManifest />
</template>
```

## Генерация иконок и splash screens

Для генерации всех иконок понадобиться один файл `.png` 512x512 с логотипом проекта на прозрачном фоне.

[Генератор иконок (PWA Builder)](https://www.pwabuilder.com/imageGenerator):

- Загрузить файл >
- Выбрать padding (обычно 0 или 0.1-0.2) >
- Указать в background color фоновый цвет иконки >
- Выбрать под какие сторы необходимы иконки

Как результат генератор должен выдать архив:

```
android/
    <...>.png
ios/
   <...>.png
windows/
   <...>.png
```

[Генератор spalsh screens (Progressier)](https://progressier.com/pwa-icons-and-ios-splash-screen-generator):

- Выбрать файл >
- Указать в fill color фоновый цвет иконки >
- Подогнать настройки отображения под себя >

Как результат будет папка `splash_screens` с огромных количеством `.png` файлов. P.S. splash screen это то, что показывается на ios во время загрузки приложения

Рекомендую положить все папки в `frontend/public/pwa/`. В итоге должно получиться что такое:

```
frontend/
    public/
        pwa/
            android/
                <...>.png
            ios/
               <...>.png
            splash_screens/
               <...>.png
            windows/
               <...>.png
```

## Подключение иконок к приложеню

Тут будет только подключение splash screens, иконки в конце в полном конфиге

::: details

```typescript
useHead({
	link: [
		{ rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_17_Pro_Max__iPhone_16_Pro_Max_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_17_Pro__iPhone_17__iPhone_16_Pro_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_Air_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_17e__iPhone_16e__iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_11__iPhone_XR_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/13__iPad_Pro_M4_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/12.9__iPad_Pro_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/11__iPad_Pro_M4_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/10.9__iPad_Air_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/10.5__iPad_Air_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/10.2__iPad_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
			href: '/pwa/splash_screens/8.3__iPad_Mini_landscape.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_17_Pro_Max__iPhone_16_Pro_Max_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_17_Pro__iPhone_17__iPhone_16_Pro_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_Air_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_17e__iPhone_16e__iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_11__iPhone_XR_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/13__iPad_Pro_M4_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/12.9__iPad_Pro_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/11__iPad_Pro_M4_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/10.9__iPad_Air_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/10.5__iPad_Air_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/10.2__iPad_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png',
		},
		{
			rel: 'apple-touch-startup-image',
			media: 'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
			href: '/pwa/splash_screens/8.3__iPad_Mini_portrait.png',
		},
	],
});
```

:::

## Полный конфиг PWA

::: details

```typescript
export default defineNuxtConfig({
	pwa: {
		devOptions: {
			enabled: false,
			type: 'module',
		},

		/** Способ обновления приложения */
		registerType: 'autoUpdate', // autoUpdate для автоматического обновления при подключении к сети / prompt для ручного обновления
		/** Метод подключения скрипта воркера */
		injectRegister: 'auto', // false | "inline" | "script" | "script-defer" | "auto"

		manifest: {
			name: 'Студия Игоря Кулагина: создание и поддержка сайтов и брендов',
			short_name: 'Kulaginstudio',
			/** Формат отображения приложения */
			display: 'standalone', // "fullscreen" | "standalone" | "minimal-ui" | "browser"
			background_color: '#F5F3E3',
			theme_color: '#0E0E10',
			start_url: '/',
			scope: '/',
			/** Массив иконок */
			icons: [
				{
					src: '/pwa/windows/SmallTile.scale-100.png',
					sizes: '71x71',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/SmallTile.scale-125.png',
					sizes: '89x89',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/SmallTile.scale-150.png',
					sizes: '107x107',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/SmallTile.scale-200.png',
					sizes: '142x142',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/SmallTile.scale-400.png',
					sizes: '284x284',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square150x150Logo.scale-100.png',
					sizes: '150x150',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square150x150Logo.scale-125.png',
					sizes: '188x188',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square150x150Logo.scale-150.png',
					sizes: '225x225',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square150x150Logo.scale-200.png',
					sizes: '300x300',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square150x150Logo.scale-400.png',
					sizes: '600x600',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Wide310x150Logo.scale-100.png',
					sizes: '310x150',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Wide310x150Logo.scale-125.png',
					sizes: '388x188',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Wide310x150Logo.scale-150.png',
					sizes: '465x225',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Wide310x150Logo.scale-200.png',
					sizes: '620x300',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Wide310x150Logo.scale-400.png',
					sizes: '1240x600',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/LargeTile.scale-100.png',
					sizes: '310x310',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/LargeTile.scale-125.png',
					sizes: '388x388',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/LargeTile.scale-150.png',
					sizes: '465x465',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/LargeTile.scale-200.png',
					sizes: '620x620',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/LargeTile.scale-400.png',
					sizes: '1240x1240',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.scale-100.png',
					sizes: '44x44',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.scale-125.png',
					sizes: '55x55',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.scale-150.png',
					sizes: '66x66',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.scale-200.png',
					sizes: '88x88',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.scale-400.png',
					sizes: '176x176',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/StoreLogo.scale-100.png',
					sizes: '50x50',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/StoreLogo.scale-125.png',
					sizes: '63x63',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/StoreLogo.scale-150.png',
					sizes: '75x75',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/StoreLogo.scale-200.png',
					sizes: '100x100',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/StoreLogo.scale-400.png',
					sizes: '200x200',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/SplashScreen.scale-100.png',
					sizes: '620x300',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/SplashScreen.scale-125.png',
					sizes: '775x375',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/SplashScreen.scale-150.png',
					sizes: '930x450',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/SplashScreen.scale-200.png',
					sizes: '1240x600',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/SplashScreen.scale-400.png',
					sizes: '2480x1200',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-16.png',
					sizes: '16x16',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-20.png',
					sizes: '20x20',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-24.png',
					sizes: '24x24',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-30.png',
					sizes: '30x30',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-32.png',
					sizes: '32x32',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-36.png',
					sizes: '36x36',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-40.png',
					sizes: '40x40',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-44.png',
					sizes: '44x44',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-48.png',
					sizes: '48x48',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-60.png',
					sizes: '60x60',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-64.png',
					sizes: '64x64',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-72.png',
					sizes: '72x72',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-80.png',
					sizes: '80x80',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-96.png',
					sizes: '96x96',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.targetsize-256.png',
					sizes: '256x256',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-16.png',
					sizes: '16x16',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-20.png',
					sizes: '20x20',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-24.png',
					sizes: '24x24',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-30.png',
					sizes: '30x30',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-32.png',
					sizes: '32x32',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-36.png',
					sizes: '36x36',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-40.png',
					sizes: '40x40',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-44.png',
					sizes: '44x44',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-48.png',
					sizes: '48x48',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-60.png',
					sizes: '60x60',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-64.png',
					sizes: '64x64',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-72.png',
					sizes: '72x72',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-80.png',
					sizes: '80x80',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-96.png',
					sizes: '96x96',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-unplated_targetsize-256.png',
					sizes: '256x256',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-16.png',
					sizes: '16x16',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-20.png',
					sizes: '20x20',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-24.png',
					sizes: '24x24',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-30.png',
					sizes: '30x30',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-32.png',
					sizes: '32x32',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-36.png',
					sizes: '36x36',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-40.png',
					sizes: '40x40',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-44.png',
					sizes: '44x44',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-48.png',
					sizes: '48x48',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-60.png',
					sizes: '60x60',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-64.png',
					sizes: '64x64',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-72.png',
					sizes: '72x72',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-80.png',
					sizes: '80x80',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-96.png',
					sizes: '96x96',
					type: 'image/png',
				},
				{
					src: '/pwa/windows/Square44x44Logo.altform-lightunplated_targetsize-256.png',
					sizes: '256x256',
					type: 'image/png',
				},
				{
					src: '/pwa/android/launchericon-512x512.png',
					sizes: '512x512',
					type: 'image/png',
				},
				{
					src: '/pwa/android/launchericon-192x192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/pwa/android/launchericon-144x144.png',
					sizes: '144x144',
					type: 'image/png',
				},
				{
					src: '/pwa/android/launchericon-96x96.png',
					sizes: '96x96',
					type: 'image/png',
				},
				{
					src: '/pwa/android/launchericon-72x72.png',
					sizes: '72x72',
					type: 'image/png',
				},
				{
					src: '/pwa/android/launchericon-48x48.png',
					sizes: '48x48',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/16.png',
					sizes: '16x16',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/20.png',
					sizes: '20x20',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/29.png',
					sizes: '29x29',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/32.png',
					sizes: '32x32',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/40.png',
					sizes: '40x40',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/50.png',
					sizes: '50x50',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/57.png',
					sizes: '57x57',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/58.png',
					sizes: '58x58',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/60.png',
					sizes: '60x60',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/64.png',
					sizes: '64x64',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/72.png',
					sizes: '72x72',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/76.png',
					sizes: '76x76',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/80.png',
					sizes: '80x80',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/87.png',
					sizes: '87x87',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/100.png',
					sizes: '100x100',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/114.png',
					sizes: '114x114',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/120.png',
					sizes: '120x120',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/128.png',
					sizes: '128x128',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/144.png',
					sizes: '144x144',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/152.png',
					sizes: '152x152',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/167.png',
					sizes: '167x167',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/180.png',
					sizes: '180x180',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/256.png',
					sizes: '256x256',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/512.png',
					sizes: '512x512',
					type: 'image/png',
				},
				{
					src: '/pwa/ios/1024.png',
					sizes: '1024x1024',
					type: 'image/png',
				},
			],
		},

		workbox: {
			/** Авто-очистка кэша */
			cleanupOutdatedCaches: true,
			clientsClaim: true,
			skipWaiting: true,

			// Если navigation-запрос падает — отдаём offline
			navigateFallback: '/offline.html',
			globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,webmanifest}'],

			runtimeCaching: [
				// Nuxt build assets
				{
					urlPattern: /^\/_nuxt\/.*/i,
					handler: 'CacheFirst',
					options: {
						cacheName: 'nuxt-assets',
						expiration: {
							maxEntries: 200,
						},
					},
				},

				// Directus assets через nginx proxy
				{
					urlPattern: /^\/api\/cms\/assets\/.*/i,
					handler: 'CacheFirst',
					options: {
						cacheName: 'cms-assets',
						expiration: {
							maxEntries: 300,
						},
					},
				},
			],
		},
	},
});
```

:::
