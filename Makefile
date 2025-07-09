# CleanDrive - Makefile
.PHONY: help install dev test clean

help: ## Показать справку
	@echo "CleanDrive - Команды:"
	@echo "  make install  - Установить зависимости"
	@echo "  make dev      - Запустить dev-server"
	@echo "  make test     - Проверить систему"
	@echo "  make clean    - Очистить временные файлы"

install: ## Установить зависимости
	@echo "📦 Установка зависимостей..."
	@python3 -m venv .venv
	@.venv/bin/pip install -r requirements.txt
	@echo "✅ Готово"

dev: ## Запустить dev-server
	@echo "🚀 Запуск dev-server..."
	@.venv/bin/python dev-server.py

test: ## Проверить систему
	@echo "🧪 Проверка системы..."
	@python3 --version
	@[ -d ".venv" ] && echo "✅ Виртуальное окружение" || echo "❌ Виртуальное окружение"
	@[ -f ".env" ] && echo "✅ Конфигурация" || echo "⚠️ Конфигурация"
	@curl -s http://localhost:3000 >/dev/null && echo "✅ Сервер" || echo "⚠️ Сервер"

clean: ## Очистить временные файлы
	@echo "🧹 Очистка..."
	@find . -name "*.pyc" -delete
	@find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name ".DS_Store" -delete 2>/dev/null || true
	@echo "✅ Готово"

.DEFAULT_GOAL := help
