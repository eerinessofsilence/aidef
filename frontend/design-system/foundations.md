# Базовые стили AI DEF

## Цвета

Глобальные CSS-переменные объявлены в [index.css](../src/index.css) и через
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

### Тёмные поверхности

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

### Светлые поверхности

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

## Шрифт и типографика

`Inter, system-ui, sans-serif`, базовый размер `html` — 16px. Локальные WOFF2
в [src/assets/fonts](../src/assets/fonts/) подключены с `font-display: swap`.
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

## Сетка и адаптивность

Breakpoints Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px,
`2xl` 1536px. В `index.css` нет их переопределения. `max-md` относится к
ширине меньше 768px, `md` — от 768px.

### Контейнеры

Значения из [index.css](../src/index.css); ширина до первого breakpoint —
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

## Отступы и размеры

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

## Скругления и глубина

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

## Движение

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

## Изображения и иконки

Hero использует `object-cover`; product hero — `aspect-8/9` на небольших
экранах и `lg:aspect-video`; карточки продуктов в home-карусели — `aspect-5/7`,
карточки статей — `aspect-16/10`, Gallery и модули портала — `aspect-4/3`.
Не меняй размер media после загрузки.

Иконки интерфейса — Lucide, стрелки карусели — Tabler. Маркетинговые
иллюстрации и логотипы находятся в `public/`. У overview иконки могут быть
Lucide или загруженным файлом; декоративные изображения имеют пустой alt.
Используй существующие `logo-ai-def.svg` и `logo-for-footer.svg` для бренда.
