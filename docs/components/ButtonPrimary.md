# Theplace-kit <br> ButtonPrimary

Универсальный компонент кнопки, который может рендериться как `<button>`, `<a>` или `NuxtLink` в зависимости от переданного пропса `is`.

- Динамически выбирает HTML-тег или компонент (`button`, `a`, `NuxtLink`)
- Автоматически прокидывает корректные атрибуты:
    - `to` для `NuxtLink`
    - `href`, `target`, `rel` для `<a>`
    - `type` для `<button>`
- Поддерживает `target="_blank"` с безопасным `rel="noopener noreferrer"`
- Объединяет `attrs` и `$attrs` для передачи дополнительных атрибутов

## Props

| Prop         | Тип                                                            | По умолчанию        | Описание                      |
| ------------ | -------------------------------------------------------------- | ------------------- | ----------------------------- |
| `is`         | `'button' \| 'a' \| 'NuxtLink'`                                | `'a'`               | Тип элемента   |
| `to`         | `RouteLocationAsRelativeGeneric \| RouteLocationAsPathGeneric` | `{ name: 'index' }` | Маршрут для `NuxtLink`        |
| `href`       | `string`                                                       | `'/'`               | URL для `<a>`                 |
| `buttonType` | `string`                                                       | `'button'`          | Атрибут `type` для `<button>` |
| `target`     | `'_blank' \| '_self' \| '_parent' \| '_top' \| ''`             | `''`                | Атрибут `target` для `<a>`    |
| `id`         | `string`                                                       | `''`                | HTML `id` атрибут             |
| `arrow`      | `boolean`                                                      | `false`             | Показывает иконку стрелки     |
| `class`      | `string \| Record<string, any>`                                | `''`                | Дополнительные CSS-классы     |

## Поведение

- В зависимости от `is`:
    - `NuxtLink` → используется компонент `NuxtLink` с пропсом `to`
    - `button` → рендерится `<button>` с `type`
    - `a` → рендерится `<a>` с `href`, `target`, `rel`
- Если `target="_blank"`, автоматически добавляется `rel="noopener noreferrer"`
- Если `id` не передан, атрибут не добавляется в DOM
- Все дополнительные атрибуты (`$attrs`) пробрасываются в корневой элемент

## Пример использования

```vue
<ButtonPrimary>Click me</ButtonPrimary>

<ButtonPrimary is="button" buttonType="submit">
  Submit
</ButtonPrimary>

<ButtonPrimary is="a" href="https://example.com" target="_blank">
  External link
</ButtonPrimary>

<ButtonPrimary is="NuxtLink" :to="{ name: 'about' }">
  Go to About
</ButtonPrimary>

<ButtonPrimary arrow>
  Learn more
</ButtonPrimary>
```