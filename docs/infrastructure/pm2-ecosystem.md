# Theplace-kit <br> PM2 Ecosystem Config

## Назначение

`ecosystem.config.js` — конфигурационный файл для **PM2** (Process Manager), который управляет запуском Nuxt-приложения (frontend) в production-среде.

Файл обеспечивает стабильную работу приложения, автоматический рестарт при падениях, управление логами и настройку окружения.

## Содержимое файла

```js
module.exports = {
	apps: [
		{
			name: '<название_проекта>-frontend',
			script: '/srv/<название_проекта>/frontend/.output/server/index.mjs',
			cwd: '/srv/<название_проекта>',

			instances: 1,
			exec_mode: 'fork',
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',

			// Логи
			output: '/srv/<название_проекта>/logs/output.log',
			error: '/srv/<название_проекта>/logs/error.log',
			combine_logs: false,

			env: {
				NODE_ENV: 'production',
				NITRO_PORT: 3000,
				NITRO_HOST: '0.0.0.0', // для превью
				// NITRO_HOST: '127.0.0.1',      // для продакшена с nginx
			},
		},
	],
};
```

## Основные параметры

| Параметр             | Значение                        | Описание                                                         |
| ------------------   | ------------------------------- | -----------------------------------                              |
| `name`               | `<название_проекта>-frontend`   | Имя процесса в PM2 (используется в командах pm2 restart <name>)  |
| `script`             | `.../.output/server/index.mjs`  | Точка входа после сборки Nuxt (Nitro)                            |
| `cwd`                | `/srv/<название_проекта>`       | Рабочая директория проекта                                       |
| `instances`          | `1`                             | Количество экземпляров (можно увеличить для кластера)            |
| `exec_mode`          | `'fork'`                        | Режим запуска (fork — проще, cluster — для высокой нагрузки)     |
| `autorestart`        | `true`                          | Автоматический перезапуск при падении                            |
| `max_memory_restart` | `'1G'`                          | Перезапуск при превышении использования памяти                   |
| `watch`              | `false`                         | Отключён (не следит за изменениями файлов в продакшене)          |

## Логи

- `output` — стандартный вывод (`console.log`)
- `error` — ошибки и `console.error`
- `combine_logs: false` — отдельные файлы для output и error

## Переменные окружения

- `NODE_ENV: 'production'`
- `NITRO_PORT: 3000`
- `NITRO_HOST`:
    - `'0.0.0.0'` — доступен извне (для тестирования / прямого доступа)
    - `'127.0.0.1'` — только локально (рекомендуется для продакшена за Nginx)

## Как запускать

- `pm2 start ecosystem.config.js`
- `pm2 reload <название_проекта>-frontend`
- `pm2 restart <название_проекта>-frontend`

НО, не рекомендуется запускать каманды напрямую. Лучше использовать `Makefile` проекта, во избежании проблем да и просто для удобства