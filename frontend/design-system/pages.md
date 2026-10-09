# Паттерны страниц AI DEF

Все пути ниже приведены без языкового префикса. Локализованные версии
используют те же компоненты и стили. `/store` исключён из дизайн системы.

## Карта страниц

| Страница | Визуальный паттерн | Исходник |
| --- | --- | --- |
| `/` | Media hero, тёмные секции, стеклянные карточки, белые CTA | [Home](../src/pages/Home.tsx), [home компоненты](../components/home/) |
| `/solutions` | Video hero, тёмный вводный блок, белая содержательная секция | [Solutions](../src/pages/Solutions.tsx) |
| `/technology` | Video hero, фотографии на всю ширину, стеклянные карточки поверх media | [Technology](../src/pages/Technology.tsx) |
| `/products/:slug` | Media hero, общий overview, feature блоки, Gallery, CTA | [ProductDetail](../src/pages/ProductDetail.tsx) |
| `/civil-products/:slug` | Аналогичная продуктовая композиция с общим overview | [CivilProductDetail](../src/pages/CivilProductDetail.tsx) |
| `/blog` | Белая оболочка, hero со статьёй, светлые карточки, фильтры и поиск | [Blog](../src/pages/Blog.tsx) |
| `/blog/:post` | Белая оболочка статьи, media hero, оглавление, HTML и цитаты | [BlogPost](../src/pages/BlogPost.tsx) |
| `/about-us` | Тёмный градиентный hero, информационные карточки и pills | [AboutUs](../src/pages/AboutUs.tsx) |
| `/support` | Media hero и тёмная форма в стеклянной панели | [Support](../src/pages/Support.tsx) |
| `/terms-of-condition` | Тёмная текстовая страница с крупными разделами | [TermsOfCondition](../src/pages/TermsOfCondition.tsx) |
| `/auth` | Узкая стеклянная панель, вкладки и тёмные поля | [Auth](../src/pages/Auth.tsx) |
| `/client-portal` | Плотные тёмные панели, характеристики, модули, gallery и диалоги | [ClientPortal](../src/pages/ClientPortal.tsx) |
| `*` | Декоративная тёмная панель 404 и карточки переходов | [NotFound](../src/pages/NotFound.tsx) |

## Home

Hero занимает `h-screen`, на `max-lg` — `75vh`, на `max-sm` снова
`h-screen`. Media `object-cover`, overlay `bg-black/50`. Контент центрирован,
блок ограничен `max-w-4xl`; заголовок 36 → 48 → 60 → 72px. CTA белый.

DroneCarousel показывает карточки media в горизонтальной карусели.
FocusAreas на desktop размещает карточки вокруг центральной иллюстрации;
ниже `lg` переходит в обычную сетку. SystemIntegration — сетка стеклянных
карточек. BlogPosts — тёмные карточки статей. CustomerBenefits завершает
композицию центрированным CTA. Нижние секции загружаются по видимости;
сохраняй соответствующие skeleton и отложенную загрузку.

## Solutions и Technology

Solutions соединяет полноэкранное видео с тёмным вводным блоком
`py-37.5 pt-30` и белой секцией `py-25`, текст `#3F3737`.
Секции с иллюстрациями переключаются на вертикальное расположение ниже `lg`.
Белые поверхности здесь — существующий содержательный вариант системы.

Technology использует полноэкранные фотографии и видео, текст у нижнего
края секции и стеклянные карточки radius 20px. Заголовки контентных секций
`text-5xl max-lg:text-4xl max-md:text-3xl`, описания `text-lg max-md:text-base`.
Двухколоночная сетка карточек становится одноколоночной на `max-md`.

## Публичный и гражданский продукт

Media hero меняет `aspect-8/9` на `lg:aspect-video`. Контент поверх hero
центрирован, ширина 70%, на `max-md` 90%. Используются затемнения,
круглые стрелки и индикаторы. Общий
[OverviewSection](../components/product/OverviewSection.tsx) объединяет
вводный текст, CTA, характеристики и sub-features.

Ниже идут тёмные технологии и информационные блоки, media на всю ширину,
светлые CTA-блоки и [Gallery](../components/Gallery.tsx).
Полноширинные блоки внутри контейнера используют `w-screen`, отрицательные
margin `50vw` и смещение `left-1/2 right-1/2`. Копируй полный паттерн блока,
включая responsive поведение и фон.

ProductDetail поддерживает отдельный финальный CTA. Не предполагается
одинаковый набор блоков у гражданского продукта: стили общие, содержимое
и доступные секции зависят от существующей реализации и API.

## Blog и BlogPost

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

## AboutUs

Hero `pt-32 pb-20` с тёмным градиентом и локальными синим и фиолетовым
радиальными свечениями. Основная композиция `lg:grid-cols-[1.45fr_1fr]`.
Заголовок `text-6xl max-xl:text-5xl max-md:text-4xl`, описание 18 / 32px,
на небольших экранах 16px. Дальше идут карточки radius 24px, сетки
`md:grid-cols-2` и `xl:grid-cols-3`, pills и завершающий CTA.

## Support и Auth

Support: полноэкранный слайдер с overlay black/50, затем контактные данные
и общая форма в варианте `support`. Форма помещена в
`rounded-3xl border border-white/10 bg-white/10 p-2.5 lg:p-5 shadow-2xl
backdrop-blur-xl`, за ней размытое свечение. Контактная секция
`scroll-mt-32`, нижний отступ 96px → 64px на `max-md`.

Auth: `py-32`, центрированная панель `max-w-140` (560px), та же стеклянная
оболочка и input-рецепт. Вкладки `rounded-2xl border border-white/10
bg-white/5 p-1`, поля в сетке от `md`. Используй форму Auth как источник
стилей входа.

## ClientPortal

Основной фон дополнительно затемнён `bg-black/25`, отступ `pt-32`,
поверх него локальные радиальные свечения. Контент сочетает media,
характеристики и модули. Внутренние панели — white/5 и slate-900 с
прозрачностью, radius 16 / 24px, граница white/10.

Заголовки панелей чаще 20 / 24px, подписи 12px uppercase с tracking 0.18em,
значения выравниваются вправо. Активные действия и focus используют sky;
статусы могут использовать emerald. Модульные карточки и gallery имеют
media `aspect-4/3`, изображения диалога — `object-contain` с ограничением
высоты viewport. Сохраняй внутренний scroll длинных списков и модальных панелей.

## TermsOfCondition и 404

TermsOfCondition — тёмная текстовая композиция: `pt-52.5 pb-25`, крупный
uppercase заголовок 48px, разделы 36px bold, подписи 18px semibold,
основной текст `text-foreground/70`. Между разделами `space-y-25`.
Эти большие отступы — локальный вариант юридической страницы.

404: `pt-32 py-16`, панель radius 40px с полупрозрачным градиентом и
радиальными свечениями. Заголовок `clamp(2.8rem,6vw,5.6rem)`, карточки
переходов radius 28px, `bg-white/6 backdrop-blur-xl`. Hover карточки
поднимает её на 6px. Локальные float, drift и pulse-анимации объявлены
в `index.css` и имеют reduced-motion override.

## Общая оболочка

[Header](../components/Header.tsx), [Footer](../components/Footer.tsx),
[contact-form](../components/ui/contact-form.tsx) и
[cookie-consent](../components/ui/cookie-consent.tsx) описаны в
[components.md](components.md). Новая секция должна учитывать фиксированный
Header, существующие отступы страницы и языковые версии, а также сохранять
lazy loading media и компонентов.
