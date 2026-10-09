# Дизайн система AI DEF

Дизайн система описывает существующее оформление сайта AI DEF: маркетинговые
страницы, публичные и гражданские продукты, блог, поддержку, авторизацию,
клиентский портал и страницу 404. Используй её для новых блоков, которые должны
сочетаться с готовым интерфейсом. Store находится в разработке и исключён.

## Содержание

- [Базовые стили AI DEF](#базовые-стили-ai-def)
- [Компоненты AI DEF](#компоненты-ai-def)
- [Паттерны страниц AI DEF](#паттерны-страниц-ai-def)
- [Машиночитаемые токены](frontend/design-system/tokens.json)

## Визуальный язык

Основа сайта — Inter, тёмно-синий фон `#172b4a`, белые заголовки, вторичный
текст с прозрачностью и светлые CTA. Полупрозрачные панели, тонкие границы,
размытие фона и мягкие тени создают глубину. Крупные фотографии и видео
занимают hero и отдельные секции; поверх media используются затемнения.

Светлые поверхности — часть этой же системы. Блог и статьи помещают контент
на белые панели, Solutions и продуктовые CTA используют белые секции,
dropdown каталога и стандартная контактная форма тоже имеют светлый вариант.
Портал добавляет более плотные панели, небольшие подписи и локальные sky и
emerald акценты.

## Как использовать

1. Выбери аналог в разделе [Паттерны страниц AI DEF](#паттерны-страниц-ai-def).
2. Возьми существующий компонент или рецепт из раздела [Компоненты AI DEF](#компоненты-ai-def).
3. Используй цветовые utilities из `src/index.css`: `bg-background`,
   `text-foreground`, `text-text/75`, `border-border/15`.
4. Сохрани responsive-классы, размер media и состояния loading, empty и error
   из ближайшего аналога. Подписи бери через существующую локализацию.

Пример обычной тёмной секции на основе home BlogPosts:

```tsx
<section className="container space-y-8 py-16 max-lg:py-12">
  <div className="space-y-2 text-center">
    <h2 className="text-4xl font-semibold md:text-5xl">{title}</h2>
    <p className="text-text/75 mx-auto max-w-4xl text-base md:text-lg">
      {description}
    </p>
  </div>
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    {children}
  </div>
</section>
```

## Связь с реализацией

Срез исходников: 8 октября 2026 года. Это описание и экспорт текущих значений,
без подключения нового stylesheet и без переноса существующих компонентов.
`frontend/design-system/tokens.json` — обычный JSON с группами `value`,
`source` и `usage`; это не конфигурация Tailwind и не автоматически
генерируемый файл. Числа размеров
используют пиксели, если единица не указана в имени или строковом значении.

Источник runtime-темы — [src/index.css](frontend/src/index.css). Локальные варианты
живут в JSX. При расхождении сверяй соответствующий исходник и обновляй
документацию вместе с экспортом. Имена семантических групп в JSON нужны для
навигации по экспорту; в приложении они ещё не являются CSS-переменными.

`src/pages/Store.tsx`, `Store.css`, `store-products.ts`, `components/store/`,
`public/store/` и ветки общей формы, специфичные для store, не являются
источниками этой системы. Django admin также находится вне её области.

## Базовые стили AI DEF

### Цвета

Глобальные CSS-переменные объявлены в [index.css](frontend/src/index.css) и через
`@theme inline` доступны как Tailwind utilities. `foreground` и `text`
сейчас совпадают; их имена сохраняются по текущей реализации.

| Переменная | Значение | Utility |
| --- | --- | --- |
| `--background` | `#172b4a` | `bg-background` |
| `--foreground` | `#ffffff` | `text-foreground` |
| `--text` | `#ffffff` | `text-text` |
| `--secondary` | `#3a414d` | `bg-secondary` |
| `--muted` | `#435561` | `bg-muted` |
| `--muted-foreground` | `#51656c` | `text-muted-foreground` |
| `--text-alt` | `#1e282e` | `text-text-alt` |
| `--border` | `oklch(0.96 0.005 240)` | `border-border` |
| `--border-alt` | `oklch(0.9 0.01 240)` | `border-border-alt` |

#### Тёмные поверхности

| Роль | Реализация | Источник |
| --- | --- | --- |
| Страница | `bg-background` | index.css |
| Стеклянная карточка | `bg-white/5 border border-white/10` | AboutUs, ClientPortal |
| Усиленная панель формы | `bg-white/10 border border-white/10 backdrop-blur-xl` | Auth, Support |
| Панель overview | `linear-gradient(180deg,#1c2c46 0%,#14233a 100%)` | product/OverviewSection |
| Внутренняя панель overview | `linear-gradient(180deg,#151f31 0%,#111a2a 100%)` | product/OverviewSection |
| Карточка характеристики | `linear-gradient(180deg,#18263d 0%,#152136 100%)` | product/OverviewSection |
| Карточка sub-feature | `linear-gradient(180deg,#1b2a44 0%,#18253d 100%)` | product/OverviewSection |
| Footer | `#16243B`, верхняя граница `#0A1A34` | Footer |
| Затемнение media | `bg-black/50` | home/Hero, Support |
| Затемнение диалога | `bg-black/70 backdrop-blur-sm` | Header, cookie-consent, ClientPortal |

Текст на тёмном фоне: заголовки `text-white`, основной вторичный текст
`text-white/70` или `text-text/75`, метаданные `text-white/60` или
`text-white/65`. `/50` применяется к приглушённым подписям. Эти уровни
сохраняют прозрачность и смешиваются с конкретной поверхностью.

`border-border/15` и `border-white/15` — разные цвета: первый использует
глобальный OKLCH-токен. Не заменяй один другим при копировании компонента.

#### Светлые поверхности

| Роль | Значение | Источник |
| --- | --- | --- |
| Контент и карточки | `#ffffff` | Blog, BlogPost, Solutions |
| Заголовок списка статей | `#111827` | Blog |
| Вторичный текст списка | `#6B7280` | Blog |
| Граница фильтров | `#D1D5DB`, `#E5E7EB` | Blog |
| Фон поиска и empty state | `#F9FAFB` | Blog |
| Заголовки статьи | `#111111` | BlogPost |
| Текст статьи | `#2f2f2f` | BlogPost |
| Цитата | `#d9d9d9` | BlogPost |
| Вторичные подписи статьи | `#666666` | BlogPost |
| Активный маркер оглавления | `#6199d8` | BlogPost |
| Светлый dropdown | `#ececec` | Header |
| Текст светлой секции Solutions | `#3F3737` | Solutions |

Sky в портале обозначает локальные интерактивные акценты и focus ring,
emerald используется в статусах, rose и red — в ошибках и опасных действиях.
Основной маркетинговый CTA остаётся белым. `#0A84FF` используется для focus
в support-форме и cookie consent, а не как общий цвет CTA.

### Шрифт и типографика

`Inter, system-ui, sans-serif`, базовый размер `html` — 16px. Локальные WOFF2
в [src/assets/fonts](frontend/src/assets/fonts/) подключены с `font-display: swap`.
Есть веса 400, 500, 600 и 700, каждый с normal и italic.

| Роль | Классы и размеры | Источник |
| --- | --- | --- |
| Home hero | `text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold`: 36 / 48 / 60 / 72px | Hero |
| Обычный заголовок секции home | `text-4xl lg:text-5xl font-semibold`: 36 / 48px | SystemIntegration, CustomerBenefits |
| Заголовок home BlogPosts | `text-4xl md:text-5xl font-semibold`: 36 / 48px | BlogPosts |
| Продуктовый overview | `text-4xl max-sm:text-3xl md:text-5xl font-semibold tracking-tight` | OverviewSection |
| Название карточки | `text-lg font-semibold` либо `font-bold`: 18px | BlogPosts, SystemIntegration |
| Описание секции home | `text-base md:text-lg text-text/75`, на lg `leading-7.5` | SystemIntegration, CustomerBenefits |
| Карточка блога | `text-sm leading-6`: 14 / 24px | Blog, BlogPosts |
| Метаданные | `text-xs`: 12px; badge часто `text-[11px]` | BlogPosts, ClientPortal |
| Kicker портала | `text-xs font-semibold tracking-[0.18em] uppercase` | ClientPortal |
| Статья, HTML | `text-[16px] leading-6 text-[#2f2f2f]` | BlogPost RichTextContent |
| Статья, старые paragraphs | `text-lg sm:text-xl leading-8`: 18 / 20px, строка 32px | BlogPost |
| Статья, заголовок блока | `text-2xl sm:text-3xl font-medium leading-tight` | BlogPost |
| Статья, цитата | `text-xl sm:text-2xl leading-8` | BlogPost |

Одинаковая роль может иметь несколько уже существующих вариантов. Например,
HTML статьи и старые paragraphs имеют разные размеры. При продолжении
страницы сохраняй её текущий вариант. Hero 404 использует отдельный
`clamp(2.8rem,6vw,5.6rem)` с `leading-[0.94]` и `tracking-[-0.065em]`.

### Сетка и адаптивность

Breakpoints Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px,
`2xl` 1536px. В `index.css` нет их переопределения. `max-md` относится к
ширине меньше 768px, `md` — от 768px.

#### Контейнеры

Значения из [index.css](frontend/src/index.css); ширина до первого breakpoint —
100%. Паддинги указаны на каждую сторону, включены в размер контейнера.

| Ширина viewport | `.container` max-width / padding | `.container-big` max-width / padding |
| --- | --- | --- |
| < 640px | 100% / 16px | 100% / 20px |
| ≥ 640px | 672px / 16px | 680px / 20px |
| ≥ 768px | 800px / 32px | 816px / 30px |
| ≥ 1024px | 1056px / 32px | 1088px / 30px |
| ≥ 1280px | 1312px / 64px | 1360px / 40px |
| ≥ 1536px | 1568px / 64px | 1632px / 40px |

Это исходные правила контейнеров. Страницы дополнительно используют
`px-5`, `max-w-7xl` и другие overrides; при переносе блока сохраняй их.
Footer использует `.container-big`, большинство контента — `.container`.

Частая сетка карточек: `grid gap-5 md:grid-cols-2 xl:grid-cols-3`.
SystemIntegration: три колонки → две на `max-lg` → одна на `max-md`.
Gallery: три → две на `max-lg` → одна на `max-md`. Overview меняет порядок
описания и характеристик на `lg`. Эти варианты относятся к разным блокам.

### Отступы и размеры

Базовый шаг Tailwind — `0.25rem` (4px при текущем `html`). Используются
также дробные значения, например `p-3.5` 14px, `space-y-7.5` 30px,
`py-12.5` 50px и `py-37.5` 150px.

| Назначение | Частые значения |
| --- | --- |
| Между подписью и полем | 4 / 8px (`gap-y-1`, `gap-2`) |
| Внутри карточки | 12 / 16 / 20px (`space-y-3`, `p-4`, `p-5`) |
| Между карточками | 16 / 20 / 24px (`gap-4`, `gap-5`, `gap-6`) |
| Простая секция home | 64px → 48px на `max-lg` (`py-16 max-lg:py-12`) |
| Крупная секция home | 100px → 50px на `max-lg` (`py-25 max-lg:py-12.5`) |
| Промежуток внутри крупной секции | 100px → 60px (`space-y-25 max-lg:space-y-15`) |
| Отступ блога под header | 136px → 128px на `max-lg` (`pt-34 max-lg:pt-32`) |
| Основной CTA | 56px высота → 48px на `max-md`, padding-x 32px |
| Поле формы | padding-x 16px, padding-y 12px |

### Скругления и глубина

| Значение | Применение |
| --- | --- |
| 8px `rounded-lg` | Малые элементы и иконки overview |
| 10px `rounded-[10px]` | Media-карточка продукта в карусели, icon buttons header |
| 12px `rounded-xl` | Компактный CTA header, chips и поля поиска |
| 16px `rounded-2xl` | Основные CTA, поля, карточки блога, Gallery |
| 18px `rounded-[18px]` | FocusAreas |
| 20px `rounded-[20px]` | Header, SystemIntegration, feature карточки |
| 24px `rounded-3xl` | Панели форм, AboutUs и портал |
| 26px `rounded-[26px]` | Overview sub-features |
| 28px `rounded-[28px]` | Оболочка блога, cookie consent |
| 30px `rounded-[30px]` | Внутренняя панель overview |
| 32px `rounded-4xl` | Внешняя панель overview |
| 40px `rounded-[40px]` | Главная панель 404 |
| `rounded-full` | Badges, точки слайдера, круглые стрелки |

Повторяемая глубокая тень: `0 24px 80px rgba(0,0,0,0.28)` у overview;
у портала `0 30px 80px rgba(0,0,0,0.35)`. Карточки AboutUs используют
более короткие тени. Главный CTA получает внутренние тени на hover и active,
полные значения сохранены в `tokens.json`. Размытие стеклянных поверхностей
обычно `backdrop-blur-xl`, overlay диалога — `backdrop-blur-sm`.

### Движение

| Поведение | Значение | Источник |
| --- | --- | --- |
| Кнопка CTA и большинство hover | 300ms, `ease-out` у CTA | Hero, OverviewSection |
| Zoom изображений карточек | 500ms, `scale-105` | BlogPosts, Gallery |
| Нажатие CTA | `scale(0.93)` | Hero, Technology, AboutUs |
| ScrollReveal | 700ms, `cubic-bezier(0.22,1,0.36,1)` | ui/scroll-reveal |
| ScrollReveal смещение | 32px по вертикали, 28px по горизонтали; blur 6px | ui/scroll-reveal |
| Home hero crossfade | 1000ms | home/Hero |
| Dropdown header | 300ms, `cubic-bezier(0.22,0.61,0.36,1)` | Header |
| Product kenburns | 18s, `ease-in-out`, infinite | index.css |
| Product slide glow | 700ms, `ease`, forwards | index.css |
| Product shimmer | 1600ms, `ease`, forwards | index.css |

В `index.css` есть `prefers-reduced-motion: reduce` для шести именованных
CSS-анимаций, включая три анимации 404. Это правило не отключает все JSX
transitions или ScrollReveal. При новом блоке используй существующие
анимации и учитывай этот предел текущей реализации.

### Изображения и иконки

Hero использует `object-cover`; product hero — `aspect-8/9` на небольших
экранах и `lg:aspect-video`; карточки продуктов в home-карусели — `aspect-5/7`,
карточки статей — `aspect-16/10`, Gallery и модули портала — `aspect-4/3`.
Не меняй размер media после загрузки.

Иконки интерфейса — Lucide, стрелки карусели — Tabler. Маркетинговые
иллюстрации и логотипы находятся в `public/`. У overview иконки могут быть
Lucide или загруженным файлом; декоративные изображения имеют пустой alt.
Используй существующие `logo-ai-def.svg` и `logo-for-footer.svg` для бренда.

## Компоненты AI DEF

Рецепты ниже повторяют существующие Tailwind-классы. Они не являются новой
библиотекой React-компонентов. Если подходящий компонент уже есть, используй
его реализацию и её props.

### Кнопки

#### Основной CTA

Источник: [Hero](frontend/components/home/Hero.tsx),
[OverviewSection](frontend/components/product/OverviewSection.tsx), Technology,
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
`dispatchOpenContactModal` из [lib/contact-modal.ts](frontend/lib/contact-modal.ts).
Для перехода используй `Link` и локализованный путь. Этот CTA-рецепт не
содержит собственного focus ring; в support-форме к нему добавлен
`focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2
focus-visible:outline-none`.

#### Остальные варианты

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

### Панели и карточки

#### Тёмная карточка

Источник: [AboutUs](frontend/src/pages/AboutUs.tsx). Базовый рецепт:

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

#### Карточка продукта в карусели

Источник: [apple-cards-carousel](frontend/components/ui/apple-cards-carousel.tsx),
данные передаёт [DroneCarousel](frontend/components/home/DroneCarousel.tsx).
Media-карточка `aspect-5/7`, `rounded-[10px] p-6`, заголовок
`text-xl md:text-2xl font-semibold text-white`. Поверх media — градиент
black/50 → black/25 → transparent. При наличии видео оно появляется на hover.

Вариант `fullBleed`: ширина 360px, ниже `lg` 312px, ниже `md` 264px.
Обычный вариант: 324 / 288 / 252px. Между карточками 24px, ниже `lg` 12px;
горизонтальная прокрутка имеет скрытый scrollbar. Стрелки светлые, круглые,
48px → 40px на `max-md`, disabled-состояние `opacity-50`.

#### Карточка статьи на home

Источник: [home/BlogPosts](frontend/components/home/BlogPosts.tsx).
`rounded-2xl border border-white/10 bg-white/6`; hover поднимает на 4px,
меняет границу на `white/20` и фон на `white/8`. Изображение `aspect-16/10`,
zoom до 1.05 за 500ms. Контент `p-4 space-y-3`, заголовок
`text-lg leading-6 font-semibold`, описание `text-sm leading-6`,
метаданные `text-xs`.

#### Светлая карточка статьи

Источник: [Blog](frontend/src/pages/Blog.tsx).

```text
group block overflow-hidden rounded-2xl border border-black/5 bg-white
shadow-[0_20px_40px_-28px_rgba(0,0,0,0.35)] transition-all
hover:-translate-y-1 hover:shadow-[0_24px_44px_-24px_rgba(0,0,0,0.35)]
```

Media `aspect-16/10`, контент `p-5 space-y-3`, заголовок `#111827`, описание
`#6B7280`. Это отдельный светлый вариант, а не замена home-карточки.

#### Продуктовый overview

Переиспользуемый компонент
[OverviewSection](frontend/components/product/OverviewSection.tsx) обслуживает
ProductDetail и CivilProductDetail. Содержит заголовок, описание, CTA,
features и sub-features. Не копируй его внутреннюю сетку в отдельную страницу.

Внешняя панель `rounded-4xl p-5 my-16`, фон `#1c2c46 → #14233a`.
Внутренняя панель radius 30px, характеристики 20px, sub-features 26px.
Поверх фона — декоративная сетка 40 × 40px с `opacity-30`.
Иконки характеристик 16px в контейнере 32px; sub-feature иконки 20 / 28px
в контейнерах 40 / 56px. Stroke width Lucide — 2.25 и 2.4 соответственно.

#### Портал

[ClientPortal](frontend/src/pages/ClientPortal.tsx) использует панели
`rounded-3xl border border-white/10 bg-slate-900/70 p-5`
с тенью `0 30px 80px rgba(0,0,0,0.35)` и внутренние строки
`rounded-2xl border border-white/10 bg-white/5 p-4`.
Строки характеристик могут иметь `rounded-lg bg-slate-900/60 px-3 py-2`.
Название и значение разделяются `justify-between`, значение выравнивается
вправо. Сохраняй переносы длинных значений и ограничения ширины.

### Badges и фильтры

| Назначение | Классы |
| --- | --- |
| Категория home article | `rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-white uppercase backdrop-blur` |
| Tag портала | `rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70` |
| Неактивный фильтр Blog | `rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:border-[#9CA3AF] hover:bg-[#F9FAFB]` |
| Активный фильтр Blog | `rounded-full border border-white/50 bg-black/75 px-4 py-2 text-sm font-medium text-white` |

Фильтры Blog используют `aria-pressed`. Активное оглавление статьи получает
`aria-current="location"`, текст `#222` и маркер `#6199d8`.

### Формы

Общая реализация — [contact-form](frontend/components/ui/contact-form.tsx).
Описаны варианты `default` и `support`. Store-ветки формы исключены.
Auth повторяет тёмный input-рецепт support.

#### Тёмное поле

```text
text-foreground placeholder:text-foreground/50 focus:border-foreground/50
focus:ring-foreground/40 w-full rounded-2xl border border-white/15
bg-white/5 px-4 py-3 text-base transition focus:ring-2 focus:outline-none
```

Label `text-sm`, подпись `text-foreground/70`, между label и input 4px.
Сетка `grid gap-4 md:grid-cols-2`. Select добавляет
`appearance-none pr-12` и ChevronDown; textarea `min-h-[140px] resize-none`.

#### Светлое поле

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

#### Состояния формы

| Состояние | Оформление и поведение |
| --- | --- |
| Отправка | `disabled`, `aria-busy`, `pointer-events-none opacity-70`, подпись submitting |
| Support success | `rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100/80` |
| Support error | `rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100/80` |
| Default success | `border-emerald-200 bg-emerald-50 text-emerald-900`, radius 16px |
| Default error | `border-rose-200 bg-rose-50 text-rose-900`, radius 16px |

Success использует `role="status" aria-live="polite"`, error —
`role="alert"`. Сохраняй сообщения в контексте формы.

### Навигация и диалоги

[Header](frontend/components/Header.tsx) — фиксированный контейнер с `z-50`,
`py-5`, панелью radius 20px и градиентом чёрного 50% → 40% → 30%.
Панель имеет `border-border/50`, `backdrop-blur-xl` и внутреннюю тень
`inset 0 2px 8px rgba(255,255,255,0.25)`.
Desktop-навигация появляется от `xl`, мобильная — ниже `xl`.
Каталожный dropdown светлый `#ececec`, карточки белые radius 12px.
Account dropdown использует тёмный вариант. Сохраняй существующие
outside-click, клавиатурные обработчики и aria-атрибуты.

[Footer](frontend/components/Footer.tsx) — `bg-[#16243B] py-24`, верхняя граница
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

### Загрузка и пустые состояния

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

## Паттерны страниц AI DEF

Все пути ниже приведены без языкового префикса. Локализованные версии
используют те же компоненты и стили. `/store` исключён из дизайн системы.

### Карта страниц

| Страница | Визуальный паттерн | Исходник |
| --- | --- | --- |
| `/` | Media hero, тёмные секции, стеклянные карточки, белые CTA | [Home](frontend/src/pages/Home.tsx), [home компоненты](frontend/components/home/) |
| `/solutions` | Video hero, тёмный вводный блок, белая содержательная секция | [Solutions](frontend/src/pages/Solutions.tsx) |
| `/technology` | Video hero, фотографии на всю ширину, стеклянные карточки поверх media | [Technology](frontend/src/pages/Technology.tsx) |
| `/products/:slug` | Media hero, общий overview, feature блоки, Gallery, CTA | [ProductDetail](frontend/src/pages/ProductDetail.tsx) |
| `/civil-products/:slug` | Аналогичная продуктовая композиция с общим overview | [CivilProductDetail](frontend/src/pages/CivilProductDetail.tsx) |
| `/blog` | Белая оболочка, hero со статьёй, светлые карточки, фильтры и поиск | [Blog](frontend/src/pages/Blog.tsx) |
| `/blog/:post` | Белая оболочка статьи, media hero, оглавление, HTML и цитаты | [BlogPost](frontend/src/pages/BlogPost.tsx) |
| `/about-us` | Тёмный градиентный hero, информационные карточки и pills | [AboutUs](frontend/src/pages/AboutUs.tsx) |
| `/support` | Media hero и тёмная форма в стеклянной панели | [Support](frontend/src/pages/Support.tsx) |
| `/terms-of-condition` | Тёмная текстовая страница с крупными разделами | [TermsOfCondition](frontend/src/pages/TermsOfCondition.tsx) |
| `/auth` | Узкая стеклянная панель, вкладки и тёмные поля | [Auth](frontend/src/pages/Auth.tsx) |
| `/client-portal` | Плотные тёмные панели, характеристики, модули, gallery и диалоги | [ClientPortal](frontend/src/pages/ClientPortal.tsx) |
| `*` | Декоративная тёмная панель 404 и карточки переходов | [NotFound](frontend/src/pages/NotFound.tsx) |

### Home

Hero занимает `h-screen`, на `max-lg` — `75vh`, на `max-sm` снова
`h-screen`. Media `object-cover`, overlay `bg-black/50`. Контент центрирован,
блок ограничен `max-w-4xl`; заголовок 36 → 48 → 60 → 72px. CTA белый.

DroneCarousel показывает карточки media в горизонтальной карусели.
FocusAreas на desktop размещает карточки вокруг центральной иллюстрации;
ниже `lg` переходит в обычную сетку. SystemIntegration — сетка стеклянных
карточек. BlogPosts — тёмные карточки статей. CustomerBenefits завершает
композицию центрированным CTA. Нижние секции загружаются по видимости;
сохраняй соответствующие skeleton и отложенную загрузку.

### Solutions и Technology

Solutions соединяет полноэкранное видео с тёмным вводным блоком
`py-37.5 pt-30` и белой секцией `py-25`, текст `#3F3737`.
Секции с иллюстрациями переключаются на вертикальное расположение ниже `lg`.
Белые поверхности здесь — существующий содержательный вариант системы.

Technology использует полноэкранные фотографии и видео, текст у нижнего
края секции и стеклянные карточки radius 20px. Заголовки контентных секций
`text-5xl max-lg:text-4xl max-md:text-3xl`, описания `text-lg max-md:text-base`.
Двухколоночная сетка карточек становится одноколоночной на `max-md`.

### Публичный и гражданский продукт

Media hero меняет `aspect-8/9` на `lg:aspect-video`. Контент поверх hero
центрирован, ширина 70%, на `max-md` 90%. Используются затемнения,
круглые стрелки и индикаторы. Общий
[OverviewSection](frontend/components/product/OverviewSection.tsx) объединяет
вводный текст, CTA, характеристики и sub-features.

Ниже идут тёмные технологии и информационные блоки, media на всю ширину,
светлые CTA-блоки и [Gallery](frontend/components/Gallery.tsx).
Полноширинные блоки внутри контейнера используют `w-screen`, отрицательные
margin `50vw` и смещение `left-1/2 right-1/2`. Копируй полный паттерн блока,
включая responsive поведение и фон.

ProductDetail поддерживает отдельный финальный CTA. Не предполагается
одинаковый набор блоков у гражданского продукта: стили общие, содержимое
и доступные секции зависят от существующей реализации и API.

### Blog и BlogPost

Обе страницы: `pt-34 pb-24 max-lg:pt-32 max-md:pb-16`, `.container`,
белая оболочка radius 28px на тёмном фоне сайта.

Blog сочетает затемнённый media hero с белым CTA, featured блок,
светлую сетку статей, pills категорий, поиск и sort. Заголовки `#111827`,
вторичный текст `#6B7280`, границы `#D1D5DB` / `#E5E7EB`.
Основная сетка `md:grid-cols-2 xl:grid-cols-3`.

BlogPost на `lg` делится на оглавление шириной 240px и текст статьи.
Оглавление sticky: `lg:top-32 xl:top-34`, якорные блоки `scroll-mt-32`.
Цитата имеет серый фон `#d9d9d9`, radius 16px, quote icon и внутреннюю тень.
RichTextContent задаёт оформление заголовков, списков, изображений,
таблиц и ссылок через вложенные Tailwind-селекторы. Его обычный HTML-текст
16 / 24px отличается от старых paragraphs 18 / 32px и 20 / 32px на `sm`.
Внизу статьи расположен отдельный тёмный CTA внутри светлой оболочки.

### AboutUs

Hero `pt-32 pb-20` с тёмным градиентом и локальными синим и фиолетовым
радиальными свечениями. Основная композиция `lg:grid-cols-[1.45fr_1fr]`.
Заголовок `text-6xl max-xl:text-5xl max-md:text-4xl`, описание 18 / 32px,
на небольших экранах 16px. Дальше идут карточки radius 24px, сетки
`md:grid-cols-2` и `xl:grid-cols-3`, pills и завершающий CTA.

### Support и Auth

Support: полноэкранный слайдер с overlay black/50, затем контактные данные
и общая форма в варианте `support`. Форма помещена в
`rounded-3xl border border-white/10 bg-white/10 p-2.5 lg:p-5 shadow-2xl
backdrop-blur-xl`, за ней размытое свечение. Контактная секция
`scroll-mt-32`, нижний отступ 96px → 64px на `max-md`.

Auth: `py-32`, центрированная панель `max-w-140` (560px), та же стеклянная
оболочка и input-рецепт. Вкладки `rounded-2xl border border-white/10
bg-white/5 p-1`, поля в сетке от `md`. Используй форму Auth как источник
стилей входа.

### ClientPortal

Основной фон дополнительно затемнён `bg-black/25`, отступ `pt-32`,
поверх него локальные радиальные свечения. Контент сочетает media,
характеристики и модули. Внутренние панели — white/5 и slate-900 с
прозрачностью, radius 16 / 24px, граница white/10.

Заголовки панелей чаще 20 / 24px, подписи 12px uppercase с tracking 0.18em,
значения выравниваются вправо. Активные действия и focus используют sky;
статусы могут использовать emerald. Модульные карточки и gallery имеют
media `aspect-4/3`, изображения диалога — `object-contain` с ограничением
высоты viewport. Сохраняй внутренний scroll длинных списков и модальных панелей.

### TermsOfCondition и 404

TermsOfCondition — тёмная текстовая композиция: `pt-52.5 pb-25`, крупный
uppercase заголовок 48px, разделы 36px bold, подписи 18px semibold,
основной текст `text-foreground/70`. Между разделами `space-y-25`.
Эти большие отступы — локальный вариант юридической страницы.

404: `pt-32 py-16`, панель radius 40px с полупрозрачным градиентом и
радиальными свечениями. Заголовок `clamp(2.8rem,6vw,5.6rem)`, карточки
переходов radius 28px, `bg-white/6 backdrop-blur-xl`. Hover карточки
поднимает её на 6px. Локальные float, drift и pulse-анимации объявлены
в `index.css` и имеют reduced-motion override.

### Общая оболочка

[Header](frontend/components/Header.tsx), [Footer](frontend/components/Footer.tsx),
[contact-form](frontend/components/ui/contact-form.tsx) и
[cookie-consent](frontend/components/ui/cookie-consent.tsx) описаны в
[Компоненты AI DEF](#компоненты-ai-def). Новая секция должна учитывать фиксированный
Header, существующие отступы страницы и языковые версии, а также сохранять
lazy loading media и компонентов.
