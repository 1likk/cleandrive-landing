# 📋 Инструкции для публикации на GitHub

## 🚀 Шаги для создания репозитория на GitHub:

### 1. Создайте новый репозиторий на GitHub
1. Перейдите на https://github.com
2. Нажмите кнопку "New" или "Create repository"
3. Введите название репозитория: **cleandrive-landing**
4. Добавьте описание: **Modern responsive landing page for CleanDrive car vacuum cleaner**
5. Выберите "Public" (чтобы можно было использовать GitHub Pages)
6. **НЕ** добавляйте README.md, .gitignore или лицензию (они уже есть)
7. Нажмите "Create repository"

### 2. Подключите локальный репозиторий к GitHub
После создания репозитория, выполните команды:

```bash
# Добавить удаленный репозиторий (замените YOUR_USERNAME на ваш логин)
git remote add origin https://github.com/YOUR_USERNAME/cleandrive-landing.git

# Отправить код на GitHub
git push -u origin main
```

### 3. Настройте GitHub Pages (опционально)
1. Перейдите в Settings вашего репозитория
2. Найдите раздел "Pages"
3. В "Source" выберите "Deploy from a branch"
4. Выберите ветку "main" и папку "/ (root)"
5. Нажмите "Save"

Ваш сайт будет доступен по адресу:
`https://YOUR_USERNAME.github.io/cleandrive-landing/test.html`

### 4. Альтернативные команды для добавления origin:

Если у вас есть SSH ключ:
```bash
git remote add origin git@github.com:YOUR_USERNAME/cleandrive-landing.git
git push -u origin main
```

### 5. Проверка подключения:
```bash
git remote -v
```

Должно показать:
```
origin  https://github.com/YOUR_USERNAME/cleandrive-landing.git (fetch)
origin  https://github.com/YOUR_USERNAME/cleandrive-landing.git (push)
```

## 🎉 После успешной публикации:

Ваш проект будет доступен:
- **Код**: https://github.com/YOUR_USERNAME/cleandrive-landing
- **Сайт**: https://YOUR_USERNAME.github.io/cleandrive-landing/test.html

## 🔧 Дальнейшие изменения:

Для внесения изменений в будущем:
```bash
# Добавить изменения
git add .

# Создать коммит
git commit -m "Описание изменений"

# Отправить на GitHub
git push origin main
```

## 📝 Примеры хороших коммитов:
- `✨ Add new feature: contact form validation`
- `🐛 Fix mobile responsive issues`
- `🎨 Improve hero section design`
- `📱 Add tablet responsive styles`
- `🚀 Update animations and transitions`
