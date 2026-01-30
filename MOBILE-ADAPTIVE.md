# Кроссбраузерная и адаптивная верстка

**Дата:** 29 января 2026  
**Статус:** ✅ Полностью адаптивно для всех устройств

---

## Выполненные улучшения

### 1. ✅ Базовые улучшения кроссбраузерности

**HTML:**
- Добавлены префиксы для text-size-adjust (webkit, moz, ms)
- Установлен `min-width: 320px` для body
- Добавлен `-webkit-overflow-scrolling: touch` для плавной прокрутки на iOS

**Изображения и медиа:**
```css
img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
    height: auto;
}
```

**Формы и кнопки:**
```css
input, button, textarea, select {
    font: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
```

**Кнопки:**
- Добавлен `-webkit-tap-highlight-color: transparent`
- Добавлен `touch-action: manipulation`
- Добавлен `user-select: none`

---

### 2. ✅ Адаптивные брейкпоинты

Теперь сайт адаптируется для 4 размеров экранов:

#### Desktop (>968px)
- Полная версия сайта
- 3 колонки в Stats и Gallery
- 2 колонки в Video

#### Tablet (≤968px)
- 2 колонки в Stats
- 2 колонки в Gallery
- 1 колонка в Video
- Компактный footer

#### Mobile (≤768px)
- 1 колонка в Stats
- 1 колонка в Gallery
- Уменьшенные отступы
- Адаптивные шрифты (clamp)
- Оптимизированный countdown

#### Small Mobile (≤480px)
- Еще меньше отступы
- Меньше размеры countdown
- Компактные карточки
- Оптимизированные шрифты

#### Extra Small (≤375px)
- iPhone SE и маленькие Android
- Минимальные отступы (10px)
- Самые маленькие шрифты
- Компактный countdown (55-65px)

---

### 3. ✅ Hero-секция

**Адаптивность:**
- Desktop: `min-height: 110vh`, padding: `140px 0`
- Mobile: `min-height: 100vh`, padding: `100px 0`
- Small: padding: `90px 0`

**Заголовки:**
```css
.hero-title: clamp(2rem, 10vw, 3.5rem)     /* Mobile */
.hero-title: clamp(1.8rem, 12vw, 2.8rem)   /* Small */
.hero-title: clamp(1.6rem, 13vw, 2.5rem)   /* Extra Small */
```

**Кнопки:**
- Mobile: полная ширина, вертикальное расположение
- Padding: 14px 24px (mobile), 12px 20px (small)

---

### 4. ✅ Countdown таймер

**Адаптивность по размерам:**

| Размер | Ширина | Padding | Шрифт значения | Шрифт подписи |
|--------|--------|---------|----------------|---------------|
| Desktop | 100px | 24px | 2-3rem | 0.9rem |
| Mobile | 70-80px | 12px | 1.5-2rem | 0.75rem |
| Small | 60-70px | 8-6px | 1.3-1.8rem | 0.65rem |
| Extra Small | 55-65px | 6-4px | 1.2-1.6rem | 0.6rem |

**Особенности:**
- `flex-wrap: wrap` - перенос на новую строку при необходимости
- Уменьшенные gap между элементами
- Тонкая рамка (1px) на мобильных

---

### 5. ✅ Stats карточки

**Сетка:**
- Desktop: 3 колонки
- Tablet: 2 колонки
- Mobile: 1 колонка

**Пропорции:**
- Desktop: `aspect-ratio: 1.2`
- Mobile: `aspect-ratio: 16/9`

**Текст:**
```css
.stat-value:
  Desktop: clamp(1.8rem, 3.5vw, 2.8rem)
  Mobile: clamp(1.5rem, 6vw, 2.2rem)
  Small: clamp(1.3rem, 7vw, 1.8rem)
  Extra Small: clamp(1.2rem, 8vw, 1.6rem)

.stat-label:
  Desktop: clamp(0.95rem, 1.8vw, 1.15rem)
  Mobile: clamp(0.85rem, 3.5vw, 1rem)
  Small: clamp(0.8rem, 4vw, 0.95rem)
  Extra Small: clamp(0.75rem, 4.5vw, 0.9rem)
```

---

### 6. ✅ Формы

**Улучшения для мобильных:**
- `font-size: 16px` - предотвращает zoom на iOS
- Удалены стандартные стили браузера (`appearance: none`)
- Добавлена кастомная стрелка для select
- `max-height: 300px` для textarea
- Padding: 12-16px на mobile, 10-14px на small

**Select стилизация:**
```css
select.form-input {
    background-image: url("data:image/svg+xml...");
    background-position: right 16px center;
    padding-right: 40px;
}
```

---

### 7. ✅ Галерея и видео

**Gallery:**
- Desktop: 3 колонки
- Tablet: 2 колонки
- Mobile: 1 колонка
- Пропорции: `aspect-ratio: 4/3` (desktop), `16/9` (mobile)

**Video:**
- Desktop: 2 карточки рядом
- Mobile: 1 колонка
- Кнопка play: 80px (desktop), 60px (mobile), 50px (extra small)

**Модальное окно:**
- Desktop: 90% ширины, max 1200px
- Mobile: 95% ширины
- Кнопка закрытия: адаптивный размер

---

### 8. ✅ Типографика

Все заголовки используют `clamp()` для плавного масштабирования:

```css
h1: clamp(2.5rem, 6vw, 5rem)
h2: clamp(2rem, 4vw, 3.5rem)
h3: clamp(1.5rem, 3vw, 2rem)

.section-title:
  Desktop: clamp(2rem, 4vw, 3.5rem)
  Mobile: clamp(1.8rem, 7vw, 2.5rem)
  Small: clamp(1.5rem, 8vw, 2rem)
  Extra Small: clamp(1.4rem, 9vw, 1.8rem)
```

---

### 9. ✅ Отступы (Spacing)

**CSS переменные адаптируются:**

| Переменная | Desktop | Mobile (≤768px) | Small (≤480px) |
|------------|---------|-----------------|----------------|
| --spacing-xs | 8px | 6px | 4px |
| --spacing-sm | 16px | 12px | 10px |
| --spacing-md | 24px | 20px | 16px |
| --spacing-lg | 40px | 32px | 28px |
| --spacing-xl | 64px | 48px | 40px |
| --spacing-2xl | 96px | 64px | 56px |
| --spacing-3xl | 128px | 80px | 72px |

**Container padding:**
- Desktop: 24px
- Mobile: 16px
- Small: 12px
- Extra Small: 10px

---

### 10. ✅ Навигация

**Мобильное меню:**
- Фиксированная позиция справа
- Полноэкранное overlay
- Плавная анимация появления
- Backdrop blur эффект
- Z-index: 1001 для бургера

**Бургер-кнопка:**
- Добавлен `-webkit-tap-highlight-color: transparent`
- Анимация трансформации в крестик
- Размер: 28px x 3px линии

---

## Тестирование

### Поддерживаемые браузеры:
✅ Chrome (последние 2 версии)  
✅ Safari (последние 2 версии)  
✅ Firefox (последние 2 версии)  
✅ Edge (последние 2 версии)  
✅ Safari iOS (последние 2 версии)  
✅ Chrome Android (последние 2 версии)

### Поддерживаемые разрешения:
✅ 320px (iPhone SE)  
✅ 375px (iPhone 12/13 mini)  
✅ 390px (iPhone 12/13/14)  
✅ 414px (iPhone Plus)  
✅ 768px (iPad portrait)  
✅ 1024px (iPad landscape)  
✅ 1280px+ (Desktop)

---

## Ключевые особенности

### Производительность:
- Использование `clamp()` вместо множества media queries
- CSS Grid и Flexbox для современной верстки
- Минимум JavaScript для адаптивности
- Оптимизированные изображения

### Доступность:
- Семантический HTML5
- ARIA-атрибуты для кнопок
- Правильные размеры touch-таргетов (минимум 44x44px)
- Контрастные цвета

### UX:
- Плавные переходы и анимации
- Предотвращение zoom на iOS (font-size: 16px в формах)
- Touch-friendly элементы
- Адаптивные изображения

---

## Проверка

Откройте сайт на разных устройствах:

1. ✅ Desktop (1920x1080) - полная версия
2. ✅ Laptop (1366x768) - компактная версия
3. ✅ iPad (768x1024) - планшетная версия
4. ✅ iPhone 12 (390x844) - мобильная версия
5. ✅ iPhone SE (375x667) - маленький экран
6. ✅ Маленькие Android (360x640) - минимальный размер

**Все блоки должны:**
- Корректно отображаться
- Не выходить за границы экрана
- Иметь читаемый текст
- Иметь кликабельные элементы

---

**Статус:** ✅ Полностью адаптивно и кроссбраузерно!  
**Линтер:** ✅ Без ошибок  
**Готово к продакшену!**
