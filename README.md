# Инструкция миграции проекта

При развертивании проекта на новой машине необходимо последовательно выполнить ряд команд, пердварительно убедиться, что в корне проекта находится файлы: `package.json` и `scripts/init_postgis.sql` с необходимыми скриптами

## Поднятие контейнеров

```bash
docker compose up -d
```

## Инициализация пространственного расширения `PostgreSQL`

```bash
pnpm db:init-postgis
```

## Воостановление модели данных из бэкапа

Необходимо остановить контейнер с `Directus`, чтобы появилась возможность манипулировать базой данных, поскольку `Directus` беспрерывно подключен к ней

```bash
docker compose stop directus
```

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

## Дубликаты необходимых скриптов

### `package.json`:

```json
"scripts": {
	"db:enter": "docker exec -it directus_postgres psql -U directus -d postgres",
	"db:init-postgis": "docker exec -i directus_postgres psql -U directus -d directus < scripts/init_postgis.sql",
	"db:backup": "docker exec -t directus_postgres pg_dump -U directus directus > ./cms/backups/backup.sql",
	"db:restore": "docker exec -i directus_postgres psql -U directus -d directus < ./cms/backups/backup.sql",
	"schema:backup": "docker exec -it directus_app npx directus schema snapshot ./cms/backups/schema.yaml",
	"schema:restore": "docker exec -it directus_app npx directus schema apply ./cms/backups/schema.yaml"
}
```

### `scripts/init_postgis.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
```