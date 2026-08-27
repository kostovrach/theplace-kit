# Logger

Утилита для унифицированного логирования с автоматической временной меткой и поддержкой уровней логирования.

## Назначение

Предоставляет единый удобный способ логирования с префиксом, уровнем и точным временем вызова. Используется для отладки, мониторинга server API, composables и ключевых процессов приложения. Поддерживает фильтрацию логов через переменные окружения.

## Функционал

- Добавляет timestamp в формате `YYYY-MM-DD HH:mm:ss`
- Обновляет время только один раз в секунду (кэширование для производительности)
- Поддерживает уровни логирования: `log`, `warn`, `error`
- Фильтрует логи в зависимости от `useRuntimeConfig().logger.level` (из `.env`):
    - `WARN` — скрывает `log`
    - `ERROR` — скрывает `log` и `warn`
- Поддерживает любое количество аргументов (`...args`)
- Является обёрткой над `console.log`
- Работает как в браузере, так и на сервере

## Аргументы

| Параметр  | Тип                          | По умолчанию | Описание                                    |
| --------- | ---------------------------- | ------------ | ------------------------------------------- |
| `level`   | `'log' \| 'warn' \| 'error'` | `'log'`      | Уровень лога                                |
| `prefix`  | `string`                     | ---          | Префикс лога (например `CMS`, `CRM`, `API`) |
| `...args` | `unknown[]`                  | ---          | Любые данные для вывода в консоль           |

## Возвращаемое значение

Функция ничего не возвращает (`void`).

## Формат вывода

```bash
[YYYY-MM-DD HH:mm:ss] LEVEL [PREFIX]: ...args
```

## Пример

```log
[2026-05-12 14:32:11] LOG   [CMS]: content loaded { id: 123, title: 'Test' }
[2026-05-12 14:32:11] ERROR [CMS]: content load failed { id: 123, title: 'Test' }
```

## Пример использования

```ts
// Обычный лог (уровень по умолчанию — log)
logger('log', 'TEST', 'content loaded', { id: 123, title: 'Test' });
// [2026-05-12 14:32:11] LOG   [DEBUG]: content loaded { id: 123, title: 'Test' }

// Явное указание уровня
logger('error', 'API', 'Failed to fetch data', error);
// [2026-05-12 14:32:11] ERROR [API]: Failed to fetch data Error: ...

logger('warn', 'CMS', 'Deprecated field used', { field: 'oldName' });
// [2026-05-12 14:32:11] WARN  [CMS]: Deprecated field used { field: 'oldName' }logger('log', 'API', 'Request to /api/cms/pages', { status: 200, duration: '45ms' });
// [2026-05-12 14:32:11] LOG   [API]: Request to /api/cms/pages { status: 200, duration: '45ms' }
```

## Фильтрация через переменные окружения

Уровень логирования задаётся в `.env`:

```dotenv
# Log
LOG_LEVEL=ERROR # DEBUG / ERROR / WARN
```

- `LOG` (или любое другое значение) — выводятся все логи
- `WARN` — скрываются логи с `level: 'log'`
- `ERROR` — скрываются логи с `level: 'log'` и `level: 'warn'`
