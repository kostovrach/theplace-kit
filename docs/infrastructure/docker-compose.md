# Theplace-kit <br> Docker Compose

## Назначение

`docker-compose.yml` — основной файл оркестрации сервисов для локальной и серверной разработки/деплоя.  
Включает два основных сервиса: **PostgreSQL + PostGIS** и **Directus**.

## Сервисы

### 1. `postgres`

- Образ: `postgis/postgis:16-3.5`
- Постоянное хранилище данных с поддержкой геопространственных данных (PostGIS)
- Использует volume `postgres_data` для сохранения данных между перезапусками

### 2. `directus`

- Собирается из кастомного `Dockerfile` ( `./cms/Dockerfile` )
- Порт: `8055`
- Зависит от сервиса `postgres`
- Монтирует volumes для uploads, extensions и backups

## Ключевые volumes

| Volume                  | Путь внутри контейнера     | Назначение                    |
| ----------------------- | -------------------------- | ----------------------------- |
| `postgres_data`         | `/var/lib/postgresql/data` | База данных PostgreSQL        |
| `${PWD}/cms/uploads`    | `/directus/uploads`        | Загруженные файлы             |
| `${PWD}/cms/extensions` | `/directus/extensions`     | Кастомные расширения Directus |
| `${PWD}/cms/backups`    | `/directus/backups`        | Бэкапы                        |

## Переменные окружения

Основные переменные (определяются в `.env` файле):

### Обязательные

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `KEY`, `SECRET`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `PUBLIC_URL`
- `CORS_ENABLED`, `CORS_ORIGIN`

(При первом запуске Directus автоматически создаст администратора с указанными `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

### Хранилище файлов

- Локальное (по умолчанию):
    - `STORAGE_LOCATIONS`
    - `STORAGE_LOCAL_DRIVER`
    - `STORAGE_LOCAL_ROOT`

- S3 (закомментировано по умолчанию):
    - `STORAGE_S3_*` параметры

## Команды запуска

```bash
# Запуск в фоне
docker compose up -d
```

```bash
# Запуск с просмотром логов
docker compose up
```

```bash
# Пересборка Directus
docker compose build --no-cache directus
```

```bash
# Остановка
docker compose down
```
