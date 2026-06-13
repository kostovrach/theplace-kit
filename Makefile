.PHONY: app-build app-deploy app-restart app-reload app-init app-clean

APP_NAME     = <название_проекта>-frontend
APP_DIR      = /srv/<название_проекта>
FRONTEND_DIR = $(APP_DIR)/frontend
ICONS_DIR	 = $(FRONTEND_DIR)/app/assets/svg/gen

LOGS_DIR     = /srv/<название_проекта>/logs

help:
	@echo "Доступные команды:"
	@echo "  make app-init      - Первая инициализация"
	@echo "  make app-build     - Сборка проекта"
	@echo "  make app-deploy    - Полный деплой"
	@echo "  make app-restart   - Жёсткий рестарт pm2"
	@echo "  make app-reload    - Graceful reload pm2"
	@echo "  make app-clean     - Очистить целевую папку"
	@echo "  make app-logs      - Открыть output.log"

app-init:
	@echo "Инициализация проекта..."
	rm -rf $(ICONS_DIR) && cd $(FRONTEND_DIR) && pnpm i && pnpm build
	@echo "Проект собран"
	pm2 start $(APP_DIR)/ecosystem.config.js
	pm2 save

app-build:
	@echo "Сборка проекта..."
	rm -rf $(ICONS_DIR) && cd $(FRONTEND_DIR) && pnpm i && pnpm build
	@echo "Проект собран"

app-clean:
	@echo "Очистка папки с билдом..."
	rm -rf $(FRONTEND_DIR)/.output
	@echo "Старый билд удален"

app-deploy: app-clean app-build
	@echo "Деплой завершен. Обновление pm2..."
	pm2 reload $(APP_NAME)
	pm2 save

app-restart:
	pm2 restart $(APP_NAME)
	pm2 save

app-reload:
	pm2 reload $(APP_NAME)
	pm2 save

app-logs:
	@if [ -f $(LOGS_DIR)/output-0.log ]; then \
		code $(LOGS_DIR)/output-0.log; \
	else \
		echo "Лог ещё не создан"; \
	fi

app-logtail:
	pm2 logs $(APP_NAME) --lines 100