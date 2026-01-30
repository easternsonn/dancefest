# 📐 Структура проекта Арт-портал

## Обзор файловой структуры

```
dancefest/
│
├── 📄 index.html              # Главная HTML страница
│   ├── Семантический HTML5
│   ├── Мета-теги для SEO
│   ├── Структурированные секции
│   └── Форма заявки с полями
│
├── 📁 css/
│   └── 📄 style.css          # Главный файл стилей
│       ├── CSS Variables (цветовая схема)
│       ├── Reset стили
│       ├── Типографика
│       ├── Компоненты (header, hero, about, projects, contact, footer)
│       ├── Адаптивные breakpoints
│       └── Анимации и transitions
│
├── 📁 js/
│   └── 📄 main.js            # Главный JavaScript файл
│       ├── Мобильная навигация
│       ├── Плавная прокрутка
│       ├── Загрузка файлов
│       ├── Валидация формы (клиентская)
│       ├── AJAX отправка формы
│       └── Scroll animations
│
├── 📄 submit.php             # PHP Backend
│   ├── Валидация данных (серверная)
│   ├── Обработка загрузки MP3
│   ├── Формирование HTML письма
│   ├── Отправка email с вложением
│   └── JSON ответ
│
├── 📄 server.js              # Node.js Backend (альтернатива)
│   ├── Express сервер
│   ├── Multer (загрузка файлов)
│   ├── Nodemailer (отправка email)
│   ├── Валидация и санитизация
│   └── Error handling
│
├── 📄 package.json           # NPM зависимости
│   ├── express
│   ├── multer
│   ├── nodemailer
│   ├── cors
│   └── dotenv
│
├── 📄 env.example            # Пример конфигурации
│   └── SMTP настройки для разных провайдеров
│
├── 📄 README.md              # Полная документация
│   ├── Установка
│   ├── Настройка
│   ├── Деплой
│   └── Troubleshooting
│
├── 📄 STRUCTURE.md           # Этот файл
│
├── 📄 .gitignore             # Git игнорируемые файлы
│
└── 🖼️ logo.png               # Логотип компании
```

## Детальное описание компонентов

### 🎨 Frontend (index.html + CSS + JS)

#### HTML Структура
```
<header>      → Фиксированная навигация с логотипом
<section#home>    → Hero секция с призывом к действию
<section#about>   → О платформе, features cards
<section#projects> → Карточки проектов (Корни, Escalera, Mango Fest, Futurum)
<section#contact>  → Форма заявки с загрузкой MP3
<footer>          → Контакты и копирайт
```

#### CSS Организация
```css
/* Variables */
:root { --primary, --accent, --spacing, etc. }

/* Base */
Reset, Typography, Utilities

/* Components */
.header, .nav, .hero, .about, .projects, .contact, .footer

/* Responsive */
@media (max-width: 968px) { tablet }
@media (max-width: 768px) { mobile }
@media (max-width: 480px) { small mobile }
```

#### JavaScript Модули
```javascript
1. Navigation (burger menu, smooth scroll)
2. File Upload (validation, preview)
3. Form Validation (real-time, submit)
4. AJAX Submission (fetch API)
5. Animations (intersection observer)
```

### 🔧 Backend

#### PHP версия (submit.php)
- Использует встроенную функцию `mail()`
- Обрабатывает `multipart/form-data`
- Base64 кодирование для MP3 вложения
- HTML email шаблон

#### Node.js версия (server.js)
- Express для роутинга
- Multer для обработки файлов
- Nodemailer для SMTP
- Environment variables (.env)

## Потоки данных

### 1. Загрузка страницы
```
Браузер → index.html
        → css/style.css (стили загружаются)
        → js/main.js (инициализация скриптов)
```

### 2. Отправка формы
```
Пользователь → Заполняет форму
            → main.js (валидация)
            → FormData с MP3 файлом
            → fetch('/submit' или 'submit.php')
            → Backend (validation + email)
            → SMTP Server
            → Получатель (RECIPIENT_EMAIL)
            → JSON response
            → Сообщение пользователю (success/error)
```

## Технологические решения

### Адаптивность
- **Desktop-first** подход
- CSS Grid для карточек
- Flexbox для навигации
- Media queries для breakpoints
- Viewport units для fluid typography

### Производительность
- Минимум внешних зависимостей
- CSS Variables для быстрых изменений темы
- Lazy loading через Intersection Observer
- Оптимизированные transitions

### Безопасность
```
CLIENT SIDE                SERVER SIDE
├── HTML5 validation    → ├── Type checking
├── JS validation       → ├── Regex validation
├── File type check     → ├── MIME type check
└── Size limit (50MB)   → └── File size validation
                          ├── Sanitization (htmlspecialchars)
                          └── Email validation
```

## Цветовая схема

```css
/* Light Purple Theme */
--primary-light: #f3e5f5;   /* Backgrounds */
--primary: #ce93d8;          /* Accents */
--primary-medium: #ba68c8;   /* Hover states */
--primary-dark: #9c27b0;     /* Buttons, links */
--primary-darker: #7b1fa2;   /* Footer */

/* Gradients */
linear-gradient(135deg, #f3e5f5, #e1bee7, #ce93d8)  /* Hero */
linear-gradient(135deg, #9c27b0, #7b1fa2)            /* Footer */
```

## Типографика

```css
Font Family: 'Inter', sans-serif
Weights: 300, 400, 500, 600, 700, 800

Headings:
h1: clamp(2rem, 5vw, 3.5rem)    /* 32px - 56px */
h2: clamp(1.75rem, 4vw, 2.5rem) /* 28px - 40px */
h3: clamp(1.25rem, 3vw, 1.75rem) /* 20px - 28px */

Body: 16px base, 1.6 line-height
```

## Breakpoints

```css
/* Desktop */
> 968px   → Full desktop layout

/* Tablet */
768px - 968px → 2-column grid, smaller spacing

/* Mobile */
< 768px   → Single column, burger menu, stacked layout

/* Small Mobile */
< 480px   → Reduced font sizes, minimal spacing
```

## Deployment Options

### Option 1: Traditional Hosting (PHP)
```
Apache/Nginx → PHP 7.4+ → mail() or SMTP
Upload via FTP
Configure submit.php
```

### Option 2: Node.js Hosting
```
VPS (DigitalOcean, AWS) → PM2 → Nginx reverse proxy
or
PaaS (Heroku, Railway) → Git deploy
or
Serverless (Vercel) → Serverless functions
```

## Расширение функциональности

### Возможные дополнения
- [ ] Галерея прошлых мероприятий
- [ ] Регистрация пользователей
- [ ] Личный кабинет участника
- [ ] Онлайн-оплата
- [ ] Интеграция с соцсетями (VK, Instagram API)
- [ ] Многоязычность (i18n)
- [ ] Admin панель
- [ ] База данных для хранения заявок
- [ ] Email подтверждения для участников
- [ ] SMS уведомления
- [ ] Google Analytics / Yandex Metrika
- [ ] Google reCAPTCHA

---

**Документация актуальна на:** 2026-01-29
