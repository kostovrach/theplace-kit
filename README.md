# Theplace-kit <br> Инструкция по инициализации / миграции проекта

## Настройка VPS

### Обновление пакетов Ubuntu

```bash
sudo apt update
```

```bash
sudo apt upgrade
```

### Git

```bash
apt install git
```

### NVM (менеджер Node.js)

Установка

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Перезапуск оболочки bash

```bash
source ~/.bashrc
```

### Node.js

Установить нужную версию, например, v24.11.1

```bash
nvm install 24.11.1
```

Переключиться на установленную версию

```bash
nvm use v24.11.1
```

### pnpm

```bash
npm install -g pnpm
```

### pm2

```bash
npm install -g pm2
```

### nginx

Установка

```bash
sudo apt install nginx -y
```

Запуск

```bash
sudo systemctl start nginx
```

```bash
sudo systemctl enable nginx
```

## Создание ssh-ключа для клонирования репозитория

### Генерация ключа

```bash
ssh-keygen -t ed25519 -C "deploy-key-repoX" # имя может быть произвольным
```
Оставить passphrase пустым — для простоты ручных pull в дальнейшем

### Вывод ключа

```bash
cat ~/.ssh/id_ed25519.pub
```
Необходимо скопировать весь вывод и добавить ключ в GitHub как Deploy key для нужного репозитория
<br>
Settings → Deploy keys → Add deploy key

После этого можно клонировать репозиторий по ssh:

```bash
git clone git@github.com:OWNER/REPO.git
```

## Перенос .env
Тут сказать особо нечего, главное просто не забыть это сделать

```bash
touch .env; code .env
```

## Запуск проекта

При развертивании проекта на новой машине необходимо последовательно выполнить ряд команд, пердварительно убедиться, что в корне проекта находится файлы: `package.json` и `scripts/init_postgis.sql` с необходимыми скриптами

### Поднятие контейнеров

```bash
docker compose up -d
```

### Остановка контейнера Directus

Необходимо остановить контейнер с `Directus`, чтобы появилась возможность манипулировать базой данных, поскольку `Directus` беспрерывно подключен к ней

```bash
docker compose stop directus
```

### Инициализация пространственного расширения `PostgreSQL`

```bash
pnpm db:init-postgis
```

### Воостановление модели данных из бэкапа

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

### Запуск контейнера Directus

```bash
docker compose start directus
```

### Дубликаты необходимых скриптов

#### `package.json`:

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

#### `scripts/init_postgis.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
```

## Настройка демона pm2

Сначала нужно собрать фронтенд, предполагается, что репозиторий был склонирован в папку `srv`

```bash
cd /srv/<имя-проекта>/frontned
pnpm i
pnpm build
```

Запуск pm2

```bash
pm2 start .output/server/index.mjs # Стандартный путь к индексному файлу nuxt-приложения
```

```bash
pm2 save # Сохранение списка процессов
pm2 startup ubuntu # Или просто pm2 startup — pm2 сам выберет платформу
```

Активация демона pm2

```bash
sudo systemctl enable pm2-root
sudo systemctl start pm2-root
```

Проверка статуса

```bash
sudo systemctl status pm2-root
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

## Настройка nginx

### Активация firewall

```bash
sudo apt install ufw -y
sudo ufw allow OpenSSH  # Чтобы не потерять SSH-доступ
sudo ufw allow 80/tcp   # Для HTTP (нужен для Certbot)
sudo ufw allow 443/tcp  # Для HTTPS
sudo ufw enable
```

### Конфигурационные файлы nginx

Удаление дефолтного конфига

```bash
sudo rm /etc/nginx/sites-enabled/default
```

Создание конфигов для каждого домена (в примере: yourdomain.ru и cms.yourdomain.ru)

```bash
touch /etc/nginx/sites-available/yourdomain.ru
code /etc/nginx/sites-available/yourdomain.ru
```

```bash
touch /etc/nginx/sites-available/cms.yourdomain.ru
code /etc/nginx/sites-available/cms.yourdomain.ru
```

Перовначальное содержимое конфигов:

```conf
server {
	listen 80;
    server_name <имя-домена>.ru www.<имя-домена>.ru;

    client_max_body_size 3M; # ограничение размера на загрузку файлов в админке directus

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```conf
server {
    server_name <имя-домена>.ru www.<имя-домена>.ru;

    root /srv/<название проекта>/frontend/.output/public;
    
    location /_nuxt/ {
		# сжатие статических файлов nuxt (js/css бандлы)

        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
        gzip on;
        gzip_comp_level 6;
    }

	# общее сжатие 
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types
        text/plain text/css text/xml text/javascript
        application/javascript application/json application/xml
        image/svg+xml application/x-font-ttf font/opentype;

    gzip_vary on;

	
    location /api/cms/assets/ {
		# Проксирование запросов файлов напрямую
		# Данный блок имеет смысл, только если для сайта подключено s3 хранилище или CDN

        proxy_pass http://localhost:8055/assets/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;

        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Активация конфигов

```bash
sudo ln -s /etc/nginx/sites-available/yourdomain.ru /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/cms.yourdomain.ru /etc/nginx/sites-enabled/
```

```bash
sudo nginx -t  # Проверьте конфиг на ошибки
sudo systemctl restart nginx
```

### Настройка SSL с Certbot

Установка snap

```bash
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
```

Установка Certbot

```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

Запуск Certbot для получения сертификатов

```bash
sudo certbot --nginx -d yourdomain.ru -d www.yourdomain.ru -d cms.yourdomain.ru
```

Проверка автопродления

```bash
sudo certbot renew --dry-run
```

### Возможные ошибки

Самая частая ошибка чаще всего вызвана либо опечаткой в домене при запуске получения сертификатов, либо невалидными/не установленными A-записями для доменов, либо, в случае перененоса домена между провайдерами

Если домен был перенесен между провайдерами и возникла подобная ошибка, проблема почти точно решится сама через время

```bash
Account registered.
Requesting a certificate for yourdomain.ru and 2 more domains

Certbot failed to authenticate some domains (authenticator: nginx). The Certificate Authority reported these problems:
  Domain: cms.yourdomain.rum
  Type:   dns
  Detail: DNS problem: NXDOMAIN looking up A for cms.yourdomain.rum - check that a DNS record exists for this domain; DNS problem: NXDOMAIN looking up AAAA for cms.yourdomain.rum - check that a DNS record exists for this domain

  Domain: yourdomain.ru
  Type:   unauthorized
  Detail: 5.101.152.161: Invalid response from http://yourdomain.ru/.well-known/acme-challenge/FxwIOZ05JaT1Urt1BsiuHMInY5IvmPL4U93wDCqpuJ4: 500

  Domain: www.yourdomain.ru
  Type:   unauthorized
  Detail: 5.101.152.161: Invalid response from http://www.yourdomain.ru/.well-known/acme-challenge/H5b8yQeTCa210cwBm7QRoxtrxnrBmX0ddCr0bb8HcEU: 500

Hint: The Certificate Authority failed to verify the temporary nginx configuration changes made by Certbot. Ensure the listed domains point to this nginx server and that it is accessible from the internet.

Some challenges have failed.
Ask for help or search for solutions at https://community.letsencrypt.org. See the logfile /var/log/letsencrypt/letsencrypt.log or re-run Certbot with -v for more details.
root@ncjnazjmtx:/# sudo certbot renew --dry-run
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
No simulated renewals were attempted.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

## Настройка cron для бэкапов базы данных cms

Скрипт делает бэкап базы Directus каждые сутки в 00:00 (UTC+0 или установленная таймзона). Сам скрипт прописан в `package.json` в корне проекта, cron просто запускает его

Активировать cron

```bash
sudo crontab -e
```

Установка скрипта бэкапа (в открывшеимся файле crontab)

```bash
0 0 * * * cd /srv/<имя-проекта> && /usr/bin/pnpm dlx pnpm db:backup >/dev/null 2>&1
```

Просмотр активных скриптов

```bash
sudo crontab -l
```
