# MapWrapper

Компонент-обёртка над `vue-yandex-maps`, для отображения карты с маркерами, попапами и базовым управлением.

## Функционал

- Работает только на клиенте (`ClientOnly`)
- Использует API `vue-yandex-maps`
- Поддерживает:
    - множественные маркеры
    - popups с кастомным контентом
- Управляет активным маркером локально (`markersIdx`)
- Закрывает popup при клике по карте
- Поддерживает тему карты (`light` / `dark`)
- Опционально отображает нативное управление карты

## Props

| Prop       | Тип                                                                                           | По умолчанию     | Описание                       |
| ---------- | --------------------------------------------------------------------------------------------- | ---------------- | ------------------------------ |
| `markers`  | `{ title: string; subtitle: string \| null; point: { coordinates: LngLat; type: string } }[]` | `[]`             | Список маркеров                |
| `center`   | `LngLat`                                                                                      | `[50.18, 53.22]` | Центр карты                    |
| `zoom`     | `number`                                                                                      | `8`              | Уровень зума                   |
| `theme`    | `'light' \| 'dark'`                                                                           | `'light'`        | Тема карты                     |
| `controls` | `boolean`                                                                                     | `false`          | Показывать элементы управления |

## Поведение

- Инициализирует карту с переданными `center`, `zoom` и `theme`
- Для каждого маркера:
    - отображает точку на карте
    - по клику:
        - открывает popup
- Popup:
    - отображает `title` и `subtitle`
    - позиционируется относительно маркера
- При клике по карте:
    - закрывает активный popup
- Если `controls = true`:
    - добавляет:
        - zoom control
        - geolocation control
        - кнопку открытия в Яндекс.Картах
- `YandexMapSignpost`:
    - получает координаты всех маркеров
    - визуализирует связь между точками

## Зависимости

- `vue-yandex-maps`
- `@yandex/ymaps3-types`

## Пример использования

```vue
<template>
	<MapWrapper :markers="markers" :zoom="10" controls />
</template>

<script setup lang="ts">
const markers = [
	{
		title: 'Офис',
		subtitle: 'Главный офис',
		point: {
			coordinates: [37.6176, 55.7558],
			type: 'Point',
		},
	},
	{
		title: 'Склад',
		subtitle: null,
		point: {
			coordinates: [37.7, 55.8],
			type: 'Point',
		},
	},
];
</script>
```
