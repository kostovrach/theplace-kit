# Настройка nginx и выпуск SSL сертификатов

## Активация firewall

```bash
sudo apt install ufw -y
sudo ufw allow OpenSSH  # Чтобы не потерять SSH-доступ
sudo ufw allow 80/tcp   # Для HTTP (нужен для Certbot)
sudo ufw allow 443/tcp  # Для HTTPS
sudo ufw allow 443/udp  # Для HTTP3
sudo ufw enable
```

## Конфигурационные файлы nginx

Создание конфигов для каждого домена (в примере: yourdomain.ru и cms.yourdomain.ru)

```bash
code /etc/nginx/conf.d/yourdomain.ru.conf
```

```bash
code /etc/nginx/conf.d/cms.yourdomain.ru.conf
```

## Перовначальное содержимое конфигов

### yourdomain.ru

```txt
server {
    server_name <имя_домена>.ru www.<имя_домена>.ru;

    root /srv/<название_проекта>/frontend/.output/public;

    location /_nuxt/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
        gzip on;
        gzip_comp_level 6;
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

### cms.yourdomain.ru

```txt
server {
    server_name cms.<имя_домена>.ru www.cms.<имя_домена>.ru;

    location / {
        proxy_pass http://localhost:8055;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Проверить конфиг на ошибки. При наличии ошибок сертификаты не выпустятся.

```bash
sudo nginx -t  # Проверить конфиг на ошибки
```

## Настройка SSL с Certbot

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
sudo certbot --nginx -d yourdomain.ru -d www.yourdomain.ru -d cms.yourdomain.ru -d www.cms.yourdomain.ru
```

Проверка автопродления

```bash
sudo certbot renew --dry-run
```

## Полная конфигурация

После выпуска сертификатов нужно полностью заменить оба существующих конфига (`yourdomain.ru.conf` и `cms.yourdomain.ru.conf`) на соответсвующие (код в конце блока)

Это нужно чтобы:

- Во первых, заменить устаревший синтаксис конфига, который добавляет `Certbot`;
- Во вторых, настроить работу HTTP3, что невозможно до выпуска сертификатов.

(Важно: в новых конфигах заменить все `yourdomain.ru` на корректное имя домена, а в конфиге для основного домена в директиве `root` указать корректное название папки)

После этого:

Проверка синтаксиса:

```bash
sudo nginx -t
```

Рестарт `nginx`:

```bash
sudo systemctl restart nginx
```

### yourdomain.ru.conf

::: details

```txt
# Блок для HTTP (порт 80): редиректит абсолютно все сразу на HTTPS без www
server {
    listen 80;
    server_name yourdomain.ru www.yourdomain.ru;
    return 301 https://yourdomain.ru$request_uri;
}

# Блок для HTTPS с WWW: ловит запросы https://www.yourdomain.ru и редиректит на https://yourdomain.ru
server {
    listen 443 ssl;
    listen 443 quic;
    http2 on;
    server_name www.yourdomain.ru;

    # Заголовок поддержки HTTP3
    add_header Alt-Svc 'h3=":443"; ma=86400';

    # SSL сертификаты (необходимы, чтобы браузер не ругался до выполнения редиректа)
    ssl_certificate /etc/letsencrypt/live/yourdomain.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://yourdomain.ru$request_uri;
}

# Основной блок: обрабатывает только чистый домен https://yourdomain.ru
server {
    listen 443 ssl;
    listen 443 quic;
    http2 on;
    server_name yourdomain.ru;

    add_header Alt-Svc 'h3=":443"; ma=86400' always;

    root /srv/yourdomain/frontend/.output/public;

    # Сжатие Gzip
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types
        text/plain text/css text/xml text/javascript
        application/javascript application/json application/xml
        image/svg+xml application/x-font-ttf font/opentype;
    gzip_vary on;

    # Статика Nuxt
    location /_nuxt/ {
        try_files $uri =404;
        expires 1y;
        # Второе объявление HTTP3, поскольку в этом блоке заголовки перетираются
        add_header Alt-Svc 'h3=":443"; ma=86400' always;
        add_header Cache-Control "public, immutable";
        gzip on;
        gzip_comp_level 6;
    }

    # API Directus / CMS
    location /api/cms/assets/ {
        proxy_pass http://localhost:8055/assets/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;

        expires 1y;
        add_header Alt-Svc 'h3=":443"; ma=86400' always;
        add_header Cache-Control "public, immutable";
    }

    # Прокси на Node.js (Nuxt SSR)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        add_header Alt-Svc 'h3=":443"; ma=86400' always;
    }

    # SSL настройки основного домена
    ssl_certificate /etc/letsencrypt/live/yourdomain.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

:::

### cms.yourdomain.ru.conf

::: details

```txt
# Путь для файлов кэша nginx
proxy_cache_path /var/cache/nginx/directus_assets
                 levels=1:2
                 keys_zone=directus_assets:50m
                 max_size=2g
                 inactive=30d
                 use_temp_path=off;

# HTTPS без www
server {
    server_name cms.yourdomain.ru;

    client_max_body_size 5M; # ограничение размера на загрузку файлов в админке directus

    # Кэш для изображений
    location /assets/ {
        proxy_pass http://localhost:8055;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache directus_assets;
        proxy_cache_valid 200 30d;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        proxy_cache_background_update on;
        proxy_cache_lock on;

        proxy_ignore_headers Set-Cookie Cache-Control;
        proxy_hide_header Set-Cookie;

        add_header X-Cache-Status $upstream_cache_status always;
        add_header Alt-Svc 'h3=":443"; ma=86400' always;
    }

    location / {
        proxy_pass http://localhost:8055;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        add_header Alt-Svc 'h3=":443"; ma=86400' always;
    }

    listen 443 ssl;
    listen 443 quic reuseport;
    http2 on;
    ssl_certificate /etc/letsencrypt/live/yourdomain.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

# Редирект с HTTPS www на HTTPS без www
server {
    listen 443 ssl;
    listen 443 quic;
    server_name www.cms.yourdomain.ru;

    add_header Alt-Svc 'h3=":443"; ma=86400' always;

    ssl_certificate /etc/letsencrypt/live/yourdomain.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://cms.yourdomain.ru$request_uri;
}

# Редирект с HTTP на HTTPS без www
server {
    listen 80;
    listen [::]:80;
    server_name cms.yourdomain.ru www.cms.yourdomain.ru;

    return 301 https://cms.yourdomain.ru$request_uri;
}
```

:::

<br>

::: tip
Не забыть заменить заглушки на реальный домен и путь к папке проекта
:::

## Возможные ошибки

Самая частая ошибка при выпуске сертификатов чаще всего вызвана либо опечаткой в домене при запуске получения сертификатов, либо невалидными/не установленными A-записями для доменов, либо, в случае перененоса домена между провайдерами

Если домен был перенесен между провайдерами и возникла подобная ошибка, проблема почти точно решится сама через время

```
Account registered.
Requesting a certificate for yourdomain.ru and 2 more domains

Certbot failed to authenticate some domains (authenticator: nginx). The Certificate Authority reported these problems:
  Domain: cms.yourdomain.ru
  Type:   dns
  Detail: DNS problem: NXDOMAIN looking up A for cms.yourdomain.ru - check that a DNS record exists for this domain; DNS problem: NXDOMAIN looking up AAAA for cms.yourdomain.ru - check that a DNS record exists for this domain

  Domain: yourdomain.ru
  Type:   unauthorized
  Detail: 0.000.000.000: Invalid response from http://yourdomain.ru/.well-known/acme-challenge/: 500

  Domain: www.yourdomain.ru
  Type:   unauthorized
  Detail: 0.000.000.000: Invalid response from http://www.yourdomain.ru/.well-known/acme-challenge/: 500

Hint: The Certificate Authority failed to verify the temporary nginx configuration changes made by Certbot. Ensure the listed domains point to this nginx server and that it is accessible from the internet.

Some challenges have failed.
Ask for help or search for solutions at https://community.letsencrypt.org. See the logfile /var/log/letsencrypt/letsencrypt.log or re-run Certbot with -v for more details.
root@ncjnazjmtx:/# sudo certbot renew --dry-run
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
No simulated renewals were attempted.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```
