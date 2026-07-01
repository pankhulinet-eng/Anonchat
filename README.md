# Anonchat - Anonymous Chat Hub

> Безопасный анонимный чат с улучшенной приватностью и защитой данных

## 🎯 Возможности

### Безопасность (Security)
- 🔐 **End-to-End Encryption** - Шифрование сообщений (AES-256)
- 🛡️ **Rate Limiting** - Защита от спама и DDoS атак
- 🔍 **Content Moderation** - Автоматическая модерация контента
- 🆔 **Anonymous ID Generation** - Криптографически безопасные ID пользователей
- 🔑 **Session Management** - Управление сессиями с автоматическим истечением
- 🚫 **IP Masking** - Скрытие реального IP адреса

### Н��вые Функции (Features)
- 💬 **Group Chats** - Групповые анонимные чаты
- 📝 **Message Reactions** - Реакции на сообщения (emoji)
- 🔊 **Voice Messages** - Поддержка голосовых сообщений
- 📎 **File Sharing** - Безопасное обмена файлами
- 🌙 **Dark Mode** - Тёмная тема интерфейса
- 🧹 **Auto-Delete Messages** - Автоматическое удаление сообщений
- 🔔 **Notifications** - Push уведомления в реальном времени
- 🌍 **Multi-Language** - Поддержка множества языков
- 🎭 **Anonymous Profiles** - Анонимные профили с аватарами
- ⏱️ **Message Expiry** - Сообщения с ограниченным временем жизни

## 📋 Стек технологий

### Backend
- **Node.js + TypeScript** - Основной язык
- **Express.js** - Web фреймворк
- **PostgreSQL** - База данных
- **Redis** - Кеширование и rate limiting
- **Socket.io** - Real-time коммуникация
- **Prisma** - ORM для работы с БД

### Frontend
- **React + TypeScript** - UI фреймворк
- **Vite** - Build инструмент
- **TailwindCSS** - Стили
- **Zustand** - State management
- **TanStack Query** - Data fetching

## 🚀 Быстрый старт

### Требования
- Node.js >= 18
- PostgreSQL >= 12
- Redis >= 6

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/pankhulinet-eng/Anonchat.git
cd Anonchat

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env файл со своими настройками

# Миграция БД
npm run db:migrate

# Запуск разработки
npm run dev
```

## 🔐 Безопасность

### Реализованные меры

#### 1. Шифрование (Encryption)
```typescript
// Все сообщения шифруются перед сохранением
const encrypted = encryptMessage(message, sessionKey);
```

#### 2. Rate Limiting
```typescript
// Защита от спама: макс 10 сообщений в минуту
const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 10
});
```

#### 3. Content Moderation
```typescript
// Автоматическая проверка контента
const isClean = await moderateContent(message);
```

#### 4. Anonymous ID Generation
```typescript
// Криптографически безопасные ID
const userId = generateSecureId();
```

## 📊 API Endpoints

### Сообщения
- `POST /api/messages` - Отправить сообщение
- `GET /api/messages/:chatId` - Получить сообщения
- `DELETE /api/messages/:messageId` - Удалить сообщение

### Чаты
- `POST /api/chats` - Создать чат
- `GET /api/chats` - Список чатов
- `DELETE /api/chats/:chatId` - Удалить чат

### Пользователи
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход

## 🧪 Тестирование

```bash
# Запуск тестов
npm run test

# Тестирование с покрытием
npm run test:coverage

# E2E тестирование
npm run test:e2e
```

## 📈 Performance

- Кеширование с Redis
- Оптимизация запросов к БД
- Compression для API ответов
- CDN для статических файлов

## 🤝 Контрибьютинг

Любые pull requests приветствуются! Пожалуйста, следуйте гайдам:

1. Fork репозиторий
2. Создайте feature ветку (`git checkout -b feature/AmazingFeature`)
3. Commitьте ваши изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📝 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей

## 📧 Контакты

- GitHub: [@pankhulinet-eng](https://github.com/pankhulinet-eng)
- Email: [ваш-email@example.com](mailto:email@example.com)

---

**Made with ❤️ by Pankhulinet**
