# Embla

Набор компонентов-обёрток над `embla-carousel` для создания слайдеров с единым API: контейнер, слайды и навигация.

---

## Embla/Container

Контейнер слайдера, инициализирующий `embla-carousel` и управляющий его состоянием, опциями и плагинами.

Используется как корневой компонент слайдера. Отвечает за:

- инициализацию `Embla`
- конфигурацию оси, отступов и поведения
- подключение плагинов (autoplay, autoScroll, fade и др.)

### Особенности

- Поддержка горизонтального и вертикального направления (`axis`)
- Настройка через `options` (прокидывается в Embla)
- Поддержка плагинов:
    - `Autoplay`
    - `AutoScroll`
    - `Fade`
    - `AutoHeight`
- Остановка autoplay/autoScroll при ховере (`stopScrollOnHover`)
- Управление отступами между слайдами (`spaceBetween`)
- Поддержка `padding` и `overflow`
- Пробрасывает `emblaApi` и `emblaRef` через `defineExpose`

### Props

| Prop                | Тип                     | По умолчанию | Описание                            |
| ------------------- | ----------------------- | ------------ | ----------------------------------- |
| `options`           | `EmblaOptionsType`      | `{}`         | Опции Embla                         |
| `axis`              | `'x' \| 'y'`            | `'x'`        | Направление скролла                 |
| `spaceBetween`      | `number`                | `0`          | Отступ между слайдами               |
| `padding`           | `string`                | `'0'`        | Внутренний отступ контейнера        |
| `overflow`          | `'hidden' \| 'visible'` | `'hidden'`   | Поведение overflow                  |
| `fade`              | `boolean`               | `false`      | Включает fade-плагин                |
| `autoplay`          | `boolean`               | `false`      | Включает autoplay                   |
| `autoHeight`        | `boolean`               | `false`      | Автоматическая высота               |
| `autoScroll`        | `boolean`               | `false`      | Автоматический скролл               |
| `autoScrollOptions` | `AutoScrollOptionsType` | `{}`         | Опции autoScroll                    |
| `autoplayOptions`   | `AutoplayOptionsType`   | `{}`         | Опции autoplay                      |
| `stopScrollOnHover` | `boolean`               | `false`      | Останавливает автоскролл при ховере |

### Слоты

| Slot    | Описание               |
| ------- | ---------------------- |
| default | Слайды (`Embla/Slide`) |

### Поведение

- При инициализации формирует список плагинов в зависимости от пропсов
- При наведении/таче:
    - останавливает `autoplay` и `autoScroll` (если включено)
- При уходе курсора:
    - возобновляет работу плагинов
- Экспортирует API слайдера для внешнего управления

---

## Embla/Slide

Обёртка для отдельного слайда внутри `Embla`.

Используется для задания размеров и базовой структуры слайда.

### Особенности

- Управляет шириной (или высотой в вертикальном режиме) через `flex-basis`
- Не накладывает ограничений на содержимое

### Props

| Prop      | Тип      | По умолчанию    | Описание                    |
| --------- | -------- | --------------- | --------------------------- |
| `width`   | `string` | `'fit-content'` | Размер слайда               |
| `padding` | `string` | `'0'`           | (не используется в шаблоне) |

### Слоты

| Slot    | Описание       |
| ------- | -------------- |
| default | Контент слайда |

---

## Embla/Navigation

Компонент навигации для управления слайдером: кнопки переключения и пагинация.

Позволяет управлять слайдером извне через `emblaApi`, полученный из `Container`.

### Особенности

- Кнопки:
    - переход к предыдущему / следующему слайду
    - автоматически дизейблятся при невозможности скролла
- Пагинация:
    - отображает количество слайдов
    - подсвечивает активный
- Поддержка вертикального и горизонтального режимов
- Останавливает autoplay при ховере
- Реактивно обновляет состояние при событиях `select` и `reInit`

### Props

| Prop         | Тип                                                                    | По умолчанию    | Описание                    |
| ------------ | ---------------------------------------------------------------------- | --------------- | --------------------------- |
| `sliderRef`  | `ComputedRef<{ emblaApi: EmblaCarouselType \| null } \| null> \| null` | `null`          | Ссылка на `Embla/Container` |
| `direction`  | `'horizontal' \| 'vertical'`                                           | `'horizontal'`  | Направление навигации       |
| `size`       | `'fit-content' \| '100%' \| 'auto'`                                    | `'fit-content'` | Размер контейнера           |
| `pagination` | `boolean`                                                              | `false`         | Показывать пагинацию        |

### Поведение

- Получает `emblaApi` из `sliderRef`
- Управляет скроллом через:
    - `scrollPrev`
    - `scrollNext`
- Следит за состоянием:
    - текущий слайд (`selectedSnap`)
    - общее количество (`snapCount`)
    - доступность кнопок (`canScrollPrev`, `canScrollNext`)
- Подписывается на события:
    - `select`
    - `reInit`

---

## Пример использования

```vue
<template>
	<EmblaContainer ref="sliderRef" autoplay stopScrollOnHover>
		<EmblaSlide width="300px">Slide 1</EmblaSlide>
		<EmblaSlide width="300px">Slide 2</EmblaSlide>
		<EmblaSlide width="300px">Slide 3</EmblaSlide>
	</EmblaContainer>

	<EmblaNavigation :slider-ref="computed(() => sliderRef)" pagination />
</template>

<script setup lang="ts">
const sliderRef = ref<{ emblaApi: EmblaCarouselType | null } | null>(null);
</script>
```
