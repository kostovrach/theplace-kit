# Theplace-kit <br> Настройка nginx и выпуск SSL сертификатов

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

```conf
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

```conf
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

После выпуска сертификатов нужно полностью заменить оба существующих конфига (`yourdomain.ru.conf` и `cms.yourdomain.ru.conf`) на соответсвующие в папке [examples/nginx](/examples/nginx). Это нужно чтобы:

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
