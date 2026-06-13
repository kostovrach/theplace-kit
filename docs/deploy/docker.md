# Theplace-kit <br> Инициализация Directus в Docker-контейнере

При развертивании проекта на новой машине необходимо последовательно выполнить ряд команд, пердварительно убедиться, что в корне проекта находится файлы: `package.json` и `scripts/init_postgis.sql` с необходимыми скриптами

## Поднятие контейнеров

```bash
docker compose up -d
```

## Остановка контейнера Directus

Необходимо остановить контейнер с `Directus`, чтобы появилась возможность манипулировать базой данных, поскольку `Directus` беспрерывно подключен к ней

```bash
docker compose stop directus
```

## Инициализация пространственного расширения `PostgreSQL`

```bash
pnpm db:init-postgis
```

(все следующие шаги необходимы только при миграции проекта, когда есть бэкап БД и нужно восстановиться из него)

## Воостановление модели данных из бэкапа

После этого нужно зайти внутрь контейнера `PostgresSQL`, удалить существующую бд, создать ее заново и восстановить схему из `backup.sql`

```bash
pnpm db:enter
```

Далее внутри контейнера postgres:

```sql
DROP DATABASE directus;
```

```sql
CREATE DATABASE directus;
```

(для выхода из конйтенера postgres: `\q`)

```bash
pnpm db:restore
```

## Запуск контейнера Directus

```bash
docker compose start directus
```

## Активация прав Directus для записи файлов в папку uploads <br> (Если не подключено s3 хранилище)

Дефолтно Directus работает под UID 1000, можно проверить командой из корня проекта:

```bash
docker exec -it <directus-container-name> id node
```

Назначение Directus владельцем директории uploads

```bash
sudo chown -R 1000:1000 /srv/<имя-проекта>/cms/uploads
```

```bash
sudo chmod -R 770 /srv/<имя-проекта>/cms/uploads
```

## Дубликаты необходимых скриптов

### `package.json`:

```json
"scripts": {
	"db:enter": "docker exec -it directus_postgres psql -U directus -d postgres",
	"db:init-postgis": "docker exec -i directus_postgres psql -U directus -d directus < scripts/init_postgis.sql",
	"db:backup": "docker exec -t directus_postgres pg_dump -U directus directus > ./cms/backups/backup.sql",
	"db:restore": "docker exec -i directus_postgres psql -U directus -d directus < ./cms/backups/backup.sql",
	"db:s3-migrate": "docker exec -i directus_postgres psql -U directus -d directus -c \"UPDATE directus_files SET storage = 's3' WHERE storage = 'local';\"",
	"schema:backup": "docker exec -it directus_app npx directus schema snapshot ./cms/backups/schema.yaml",
	"schema:restore": "docker exec -it directus_app npx directus schema apply ./cms/backups/schema.yaml"
}
```

### `scripts/init_postgis.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
```
