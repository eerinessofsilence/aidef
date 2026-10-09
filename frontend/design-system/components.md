# Компоненты AI DEF

Рецепты ниже повторяют существующие Tailwind-классы. Они не являются новой
библиотекой React-компонентов. Если подходящий компонент уже есть, используй
его реализацию и её props.

## Кнопки

### Основной CTA

Источник: [Hero](../components/home/Hero.tsx),
[OverviewSection](../components/product/OverviewSection.tsx), Technology,
AboutUs, BlogPost и CustomerBenefits. Белая кнопка с чёрным uppercase текстом,
высотой 56px и скруглением 16px; ниже `md` — 48px и текст 16px.

```tsx
<button
  type="button"
  onClick={onContactClick}
  className="group relative inline-flex h-14 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white px-8 text-lg font-bold text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:h-12 max-md:text-base"
>
  {label}
</button>
```

Действие открытия общей контактной формы использует
`dispatchOpenContactModal` из [lib/contact-modal.ts](../lib/contact-modal.ts).
Для перехода используй `Link` и локализованный путь. Этот CTA-рецепт не
содержит собственного focus ring; в support-форме к нему добавлен
`focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2
focus-visible:outline-none`.

### Остальные варианты

| Вариант | Оформление | Источник |
| --- | --- | --- |
| Header CTA | `h-10 rounded-xl px-4 font-bold uppercase`, те же inset-тени; desktop от `xl` | Header |
| Support submit | `h-11 w-full rounded-2xl text-sm font-bold uppercase`, белая поверхность | contact-form |
| Default submit | `rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800`, на `max-md` полная ширина | contact-form |
| Вторичная ссылка home blog | `rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-medium text-white hover:border-white/35 hover:bg-white/12` | home/BlogPosts |
| Вторичное действие портала | `rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white`, hover sky, focus sky | ClientPortal |
| Стрелка над media | Круглая, 40–48px, затемнённая поверхность, светлая граница | Gallery, Blog, BlogPost |

Cookie consent использует собственные компактные действия `h-11 rounded-xl`:
белое принятие и полупрозрачный отказ. В них transition 200ms и active scale
0.96 / 0.97 соответственно; не подменяй их полным маркетинговым CTA.

## Панели и карточки

### Тёмная карточка

Источник: [AboutUs](../src/pages/AboutUs.tsx). Базовый рецепт:

```tsx
<article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.25)] backdrop-blur">
  <h3 className="text-xl font-semibold text-white">{title}</h3>
  <p className="mt-2 text-sm leading-6 text-white/75">{description}</p>
</article>
```

FocusAreas и SystemIntegration имеют другой вариант: radius 18 / 20px,
`border-2 border-border/15 bg-white/5 shadow-lg backdrop-blur-xl`,
hover `border-white/30 bg-white/15 shadow-xl`. SystemIntegration также
приподнимает карточку на 2px и масштабирует её до 1.05.

### Карточка продукта в карусели

Источник: [apple-cards-carousel](../components/ui/apple-cards-carousel.tsx),
данные передаёт [DroneCarousel](../components/home/DroneCarousel.tsx).
Media-карточка `aspect-5/7`, `rounded-[10px] p-6`, заголовок
`text-xl md:text-2xl font-semibold text-white`. Поверх media — градиент
black/50 → black/25 → transparent. При наличии видео оно появляется на hover.

Вариант `fullBleed`: ширина 360px, ниже `lg` 312px, ниже `md` 264px.
Обычный вариант: 324 / 288 / 252px. Между карточками 24px, ниже `lg` 12px;
горизонтальная прокрутка имеет скрытый scrollbar. Стрелки светлые, круглые,
48px → 40px на `max-md`, disabled-состояние `opacity-50`.

### Карточка статьи на home

Источник: [home/BlogPosts](../components/home/BlogPosts.tsx).
`rounded-2xl border border-white/10 bg-white/6`; hover поднимает на 4px,
меняет границу на `white/20` и фон на `white/8`. Изображение `aspect-16/10`,
zoom до 1.05 за 500ms. Контент `p-4 space-y-3`, заголовок
`text-lg leading-6 font-semibold`, описание `text-sm leading-6`,
метаданные `text-xs`.

### Светлая карточка статьи

Источник: [Blog](../src/pages/Blog.tsx).

```text
group block overflow-hidden rounded-2xl border border-black/5 bg-white
shadow-[0_20px_40px_-28px_rgba(0,0,0,0.35)] transition-all
hover:-translate-y-1 hover:shadow-[0_24px_44px_-24px_rgba(0,0,0,0.35)]
```

Media `aspect-16/10`, контент `p-5 space-y-3`, заголовок `#111827`, описание
`#6B7280`. Это отдельный светлый вариант, а не замена home-карточки.

### Продуктовый overview

Переиспользуемый компонент
[OverviewSection](../components/product/OverviewSection.tsx) обслуживает
ProductDetail и CivilProductDetail. Содержит заголовок, описание, CTA,
features и sub-features. Не копируй его внутреннюю сетку в отдельную страницу.

Внешняя панель `rounded-4xl p-5 my-16`, фон `#1c2c46 → #14233a`.
Внутренняя панель radius 30px, характеристики 20px, sub-features 26px.
Поверх фона — декоративная сетка 40 × 40px с `opacity-30`.
Иконки характеристик 16px в контейнере 32px; sub-feature иконки 20 / 28px
в контейнерах 40 / 56px. Stroke width Lucide — 2.25 и 2.4 соответственно.

### Портал

[ClientPortal](../src/pages/ClientPortal.tsx) использует панели
`rounded-3xl border border-white/10 bg-slate-900/70 p-5`
с тенью `0 30px 80px rgba(0,0,0,0.35)` и внутренние строки
`rounded-2xl border border-white/10 bg-white/5 p-4`.
Строки характеристик могут иметь `rounded-lg bg-slate-900/60 px-3 py-2`.
Название и значение разделяются `justify-between`, значение выравнивается
вправо. Сохраняй переносы длинных значений и ограничения ширины.

## Badges и фильтры

| Назначение | Классы |
| --- | --- |
| Категория home article | `rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-white uppercase backdrop-blur` |
| Tag портала | `rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70` |
| Неактивный фильтр Blog | `rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:border-[#9CA3AF] hover:bg-[#F9FAFB]` |
| Активный фильтр Blog | `rounded-full border border-white/50 bg-black/75 px-4 py-2 text-sm font-medium text-white` |

Фильтры Blog используют `aria-pressed`. Активное оглавление статьи получает
`aria-current="location"`, текст `#222` и маркер `#6199d8`.

## Формы

Общая реализация — [contact-form](../components/ui/contact-form.tsx).
Описаны варианты `default` и `support`. Store-ветки формы исключены.
Auth повторяет тёмный input-рецепт support.

### Тёмное поле

```text
text-foreground placeholder:text-foreground/50 focus:border-foreground/50
focus:ring-foreground/40 w-full rounded-2xl border border-white/15
bg-white/5 px-4 py-3 text-base transition focus:ring-2 focus:outline-none
```

Label `text-sm`, подпись `text-foreground/70`, между label и input 4px.
Сетка `grid gap-4 md:grid-cols-2`. Select добавляет
`appearance-none pr-12` и ChevronDown; textarea `min-h-[140px] resize-none`.

### Светлое поле

```text
w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm
text-neutral-900 shadow-sm outline-none transition focus:border-neutral-400
focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700
dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-500
dark:focus:ring-neutral-50/10
```

Default label `text-sm font-medium text-neutral-800`, промежуток 8px.
Звёздочка обязательного поля `text-red-500`. Dark utility-варианты в общей
форме существуют в исходниках; это не означает отдельную светлую и тёмную
тему всего сайта.

### Состояния формы

| Состояние | Оформление и поведение |
| --- | --- |
| Отправка | `disabled`, `aria-busy`, `pointer-events-none opacity-70`, подпись submitting |
| Support success | `rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100/80` |
| Support error | `rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100/80` |
| Default success | `border-emerald-200 bg-emerald-50 text-emerald-900`, radius 16px |
| Default error | `border-rose-200 bg-rose-50 text-rose-900`, radius 16px |

Success использует `role="status" aria-live="polite"`, error —
`role="alert"`. Сохраняй сообщения в контексте формы.

## Навигация и диалоги

[Header](../components/Header.tsx) — фиксированный контейнер с `z-50`,
`py-5`, панелью radius 20px и градиентом чёрного 50% → 40% → 30%.
Панель имеет `border-border/50`, `backdrop-blur-xl` и внутреннюю тень
`inset 0 2px 8px rgba(255,255,255,0.25)`.
Desktop-навигация появляется от `xl`, мобильная — ниже `xl`.
Каталожный dropdown светлый `#ececec`, карточки белые radius 12px.
Account dropdown использует тёмный вариант. Сохраняй существующие
outside-click, клавиатурные обработчики и aria-атрибуты.

[Footer](../components/Footer.tsx) — `bg-[#16243B] py-24`, верхняя граница
4px `#0A1A34`, `.container-big`. Основные подписи белые, ссылки и данные
`text-foreground/70`, вторичные строки `/50`, copyright `/25`.

| Диалог | Overlay | Панель и слой |
| --- | --- | --- |
| Общий contact | `bg-black/70 backdrop-blur-sm` | Header: `z-200`, `max-w-3xl max-h-[90vh] rounded-3xl bg-white p-6 md:p-10 overflow-y-auto` |
| Cookie consent | `bg-black/70 backdrop-blur-sm` | `z-300`, `max-w-xl rounded-[28px] border border-white/15`, градиент white/12 → white/8 → white/5 |
| Gallery | `rgba(15,19,22,0.72)` | `z-40`, `max-w-5xl rounded-3xl` |
| Media и модуль портала | `bg-black/70 backdrop-blur-sm` | `z-999`, `rounded-3xl border border-white/10 bg-slate-950/95` |

Это текущие локальные уровни, а не единая нормализованная шкала слоёв.
Стрелки home-карусели имеют `z-1100`; учитывай контекст наложения при
переиспользовании. Общий contact находится в Header и монтируется лениво.

## Загрузка и пустые состояния

На тёмных страницах skeleton повторяет геометрию будущего блока:
`animate-pulse bg-white/10`, текстовые полосы часто `rounded-full`.
ProductDetail отдельно повторяет сетку overview в fallback.
Dropdown Header использует белые карточки с `bg-black/10` skeleton.

Home BlogPosts показывает empty-сообщение в
`rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70`;
error — rose панель. Blog использует светлую empty-панель
`rounded-2xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-8`
с `text-[#6B7280]`. Сохраняй размер карточек, резервирование места под media
и существующий fallback каждой страницы.
