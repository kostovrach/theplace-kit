# Инструкция по настройке VPS

## Обновление пакетов Ubuntu

```bash
sudo apt update
```

```bash
sudo apt upgrade
```

## Git

```bash
apt install git
```

## NVM (менеджер Node.js)

Установка

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Перезапуск оболочки bash

```bash
source ~/.bashrc
```

## Node.js

Установить нужную версию ([проверть актуальную версию](https://nodejs.org/en/download))

```bash
nvm install XX.XX.X
```

Переключиться на установленную версию

```bash
nvm use vXX.XX.X
```

::: tip
Желательно использовать одну и ту же версию node при разработке и деплое
:::

## pnpm

```bash
npm install -g pnpm
```

## pm2

```bash
npm install -g pm2
```

## nginx

Ниже представлен пример установки `nginx` из официального репозитория, а не из стандартных пакетов `Ubuntu`, поскольку стандартно в `Ubuntu` устанавливается версия `1.24.x` или вообще `1.18.x`. Это legacy-версии, с устаревшим синтаксисов конфигов и отсутсвием нативной поддержки HTTP3.

Установка зависимостей для добавления нового репозитория:

```bash
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
```

Настройка репозитория на LTS версию:

```bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] https://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
```

Установка приоритетов, чтобы по умолчанию использовались официальные пакеты, а не системные:

```bash
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" | sudo tee /etc/apt/preferences.d/99nginx

```

Обазательно обновиь кэш пакетов:

```bash
sudo apt update
```

Установка, непосредственно, nginx:

```bash
sudo apt install nginx -y
```

Можно проверить версю (`nginx -v`), если выводит версию выше 1.25.x, то все окей.

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
