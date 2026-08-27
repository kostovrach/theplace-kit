# Directus Dockerfile

```dockerfile
FROM directus/directus:11.15.0

USER root

RUN apk add --no-cache \
    build-base \
    python3 \
    curl \
    ca-certificates \
    pkgconfig \
    vips-dev

USER node
```

## Пояснение по слоям

| Строка                            | Описание                                                     | 
| --------------------------------- | ------------------------------------------------------------ |
| `FROM directus/directus:11.15.0`  | Базовый официальный образ Directus указанной версии          |
| `USER root`                       | Переключение на root для установки системных пакетов         |
| `RUN apk add --no-cache ...`      | Установка необходимых пакетов Alpine                         |
| `USER node`                       | Возврат к непривилегированному пользователю (best practice)  |

## Устанавливаемые пакеты

- `build-base` — инструменты сборки (gcc, g++, make и др.)
- `python3` — требуется для компиляции некоторых npm-модулей
- `curl`, `ca-certificates` — работа с HTTPS-запросами
- `pkgconfig` — для корректной линковки библиотек
- `vips-dev` — ключевой пакет для обработки изображений в Directus