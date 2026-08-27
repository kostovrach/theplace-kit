import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	base: '/theplace-kit/',
	lang: 'ru-RU',
	title: 'ThePlace-kit',
	description: 'Библиотека компонентов и архитектурных решений на базе Nuxt и Directus',
	head: [
		['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
		['meta', { property: 'og:title', content: 'ThePlace-kit' }],
		['meta', { property: 'og:description', content: 'Библиотека компонентов и архитектурных решений на базе Nuxt и Directus' }],
	],
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config

		outline: 'deep',

		nav: [
			{ text: 'Главная', link: '/' },
			{ text: 'Документация', link: '/guide' },
			{
				text: 'Разделы',
				items: [
					{ text: 'Composables', link: '/composables/useCms' },
					{ text: 'Инфраструктура', link: '/infrastructure/docker-compose' },
					{ text: 'Серверный API', link: '/server/api/collection.get.ts' },
					{ text: 'Компоненты', link: '/components/ButtonPrimary' },
					{ text: 'Типы', link: '/types/IDirectusFile' },
					{ text: 'Утилиты', link: '/utils/logger' },
					{ text: 'Деплой', link: '/deploy/vps' },
					{ text: 'PWA', link: '/pwa' },
				],
			},
			{ text: 'v4.0.0', link: '' },
		],

		sidebar: [
			{
				items: [
					{ text: 'Введение', link: '/guide' },

					{ text: 'Конвенции', link: '/code-style' },

					{ text: '&nbsp;' },

					{
						text: 'Composables',
						base: '/composables/',
						collapsed: false,
						items: [
							{ text: 'useCms.ts', link: '/useCms' },
							{ text: 'useCmsItem.ts', link: '/useCmsItem' },
							{ text: 'useClock.ts', link: '/useClock' },
						],
					},

					{ text: '&nbsp;' },

					{
						text: 'Инфраструктура',
						base: '/infrastructure/',
						collapsed: false,
						items: [
							{ text: 'Docker-compose', link: '/docker-compose' },
							{ text: 'Directus', link: '/directus' },
							{ text: 'Makefile', link: '/makefile' },
							{ text: 'pm2-ecosystem', link: '/pm2-ecosystem' },
						],
					},

					{ text: '&nbsp;' },

					{
						text: 'Серверный API',
						base: '/server/',
						collapsed: false,
						items: [
							{ text: '[collection].get.ts', link: '/api/collection.get.ts' },
							{ text: '[collection]/[id].get.ts', link: '/api/collection-id.get.ts' },
						],
					},

					{ text: '&nbsp;' },

					{
						text: 'Компоненты',
						base: '/components/',
						collapsed: false,
						items: [
							{ text: 'ButtonPrimary.vue', link: '/ButtonPrimary' },
							{ text: 'Embla.vue', link: '/Embla' },
							{ text: 'SvgSprite.vue', link: '/SvgSprite' },
							{ text: 'Lightbox.vue', link: '/Lightbox' },
							{ text: 'FormNotify.vue', link: '/FormNotify' },
							{ text: 'MapWrapper.vue', link: '/MapWrapper' },
							{ text: 'Glass.vue', link: '/Glass' },
							{ text: 'ModalsDocs.vue', link: '/ModalsDocs' },
						],
					},

					{ text: '&nbsp;' },

					{
						text: 'Типы',
						base: '/types/',
						collapsed: false,
						items: [
							{ text: 'IDirectusFile', link: '/IDirectusFile' },
							{ text: 'ISeoSettings', link: '/ISeoSettings' },
							{ text: 'M2A-constructor', link: '/m2a-constructor' },
						],
					},

					{ text: '&nbsp;' },

					{
						text: 'Утилиты',
						base: '/utils/',
						collapsed: false,
						items: [
							{ text: 'logger.ts', link: '/logger' },
							{ text: 'slugify.ts', link: '/slugify' },
							{ text: '&nbsp;' },
							{ text: 'omit.ts', link: '/omit' },
							{ text: 'pick.ts', link: '/pick' },
							{ text: '&nbsp;' },
							{ text: 'getAssetPath.ts', link: '/getAssetPath' },
							{ text: 'isChromium.ts', link: '/isChromium' },
							{ text: '&nbsp;' },
							{ text: 'normalizeDate.ts', link: '/normalizeDate' },
							{ text: 'normalizeFileSize.ts', link: '/normalizeFileSize' },
							{ text: 'normalizePhone.ts', link: '/normalizePhone' },
							{ text: 'normalizeUrl.ts', link: '/normalizeUrl' },
							{ text: 'partialHiddenPhone.ts', link: '/partialHiddenPhone' },
						],
					},

					{ text: '&nbsp;' },

					{
						text: 'Деплой',
						base: '/deploy/',
						collapsed: false,
						items: [
							{ text: 'Настройка VPS', link: '/vps' },
							{ text: 'Настройка Nginx', link: '/nginx' },
							{ text: 'Поднятие Docker-контейнеров', link: '/docker' },
							{ text: "Сборка frontend'а", link: '/frontend' },
						],
					},

					{ text: '&nbsp;' },

					{ text: 'Перестройка на PWA', link: '/pwa' },
				],
			},
		],

		socialLinks: [{ icon: 'github', link: 'https://github.com/kostovrach/theplace-kit', target: '_blank' }],

		search: { provider: 'local' },
	},
});
