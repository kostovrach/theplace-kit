# Theplace-kit <br> Инструкция по настройке VPS

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

Установить нужную версию, например, v24.16.0

```bash
nvm install 24.16.0
```

Переключиться на установленную версию

```bash
nvm use v24.16.0
```

Желательно использовать одну и ту же версию node при разработке и деплое

## pnpm

```bash
npm install -g pnpm
```

## pm2

```bash
npm install -g pm2
```

## nginx

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
