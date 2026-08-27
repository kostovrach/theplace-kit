# Code Style

## Общие принципы

Документация и код в проекте следуют канонам Nuxt 4 + Vue 3 (Composition API, `<script setup>`).  
Ниже описаны **только специфические соглашения**, дополняющие стандартные практики.

## Структура и нейминг компонентов

### 1. Глобальные компоненты (`components/`)

- **The-префикс**  
  Компоненты, которые используются **один раз** в проекте (обычно в layouts или как корневые блоки), должны начинаться с префикса `The`:

  - `TheHeader/index.vue`
  - `TheFooter/index.vue`
  - `TheSidebar/index.vue`

- **Папка `components/c/`** (c = components)  
  Переиспользуемые самостоятельные блоки/компоненты.  
  Название файла — **PascalCase**.

  Примеры:
  - `components/c/CasesSlider.vue`
  - `components/c/Promo.vue`
  - `components/c/TestimonialCard.vue`

- **Папка `components/p/`** (p = pages)  
  Компоненты, привязанные к конкретной странице.  
  Название файла — **PascalCase**.

  Примеры:
  - `components/p/home/Hero.vue`
  - `components/p/contacts/Map.vue`
  - `components/p/about/Team.vue`

- **Модальные окна**  
  Все модалки находятся в папке `components/modals`.  
  Название — **PascalCase** без дополнительного префикса.

  Примеры:
  - `components/modals/ContactModal.vue`
  - `components/modals/ConfirmModal.vue`

- **Кнопки и ссылки**  
  Группируются в отдельные папки:

  - `components/Button/primary.vue`
  - `components/Button/rolling.vue`
  - `components/Button/outline.vue`
  - `components/Link/primary.vue` и т.д.

### 2. Shared

Все общие типы и утилиты располагаются в папке `shared`:

- `shared/types/` — интерфейсы, типы, enums
- `shared/utils/` — утилитарные функции (`slugify`, `omit`, `normalizePhone` и т.д.)

## Работа с иконками

- Все SVG-иконки хранятся в `app/assets/svg/`
- Рекомендуется группировать иконки по папкам:
  - `common/` — универсальные иконки
  - `logo/` — логотипы
  - `ui/` — элементы интерфейса
  - `flags/`, `social/`, `navigation/` и т.д.

- **Важное правило**:  
  Для иконок, цвет которых должен управляться через CSS, необходимо вручную добавить атрибут `fill="currentColor"` (да, именно `fill="currentColor"`, `stroke`-иконки не поддерживаются в спрайте) в SVG-файл.

## Дополнительные соглашения

- Все утилиты и composables экспортируются с `export` (не `export default`)
- Интерфейсы именуются с префиксом `I`, например, `IDirectusFile`, `ISeoSettings` и т.д.
- Типы именуются с суффиксом `Type` в конце, например, `StateType`, `ThemeType` и т.д.
- Функции-утилиты именуются в `camelCase` с логическим префиксом `normalize*`, `get*`, `is*`, `expand*` и т.д.
