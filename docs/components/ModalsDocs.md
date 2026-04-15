# Theplace-kit <br> ModalDocs

Модальное окно для отображения текстового (HTML) контента документации с поддержкой состояний загрузки, ошибки и успешного получения данных.

Используется для показа статических или загружаемых документов (например: политика конфиденциальности, условия использования и т.д.) в виде выезжающего сайд-модала.

## Функционал

- Построен на основе `vue-final-modal`
- Анимации:
    - overlay: `fade`
    - контент: `slide-right`
- Поддерживает свайп для закрытия (`swipe-to-close="right"`)
- Отображает разные состояния загрузки:
    - `idle` / `pending` → skeleton loader
    - `error` → компонент ошибки
    - `success` → HTML-контент
- Использует `v-html` для рендера контента
- Отображает дату последнего обновления
- Вертикальный скролл с скрытым scrollbar

## Props

| Prop          | Тип                      | По умолчанию | Описание                   |
| ------------- | ------------------------ | ------------ | -------------------------- |
| `title`       | `string`                 | `''`         | Заголовок документа        |
| `dateUpdated` | `string`                 | `''`         | Дата последнего обновления |
| `content`     | `string`                 | `''`         | HTML-контент документа     |
| `status`      | `AsyncDataRequestStatus` | `'idle'`     | Статус загрузки данных     |

## Зависимости

- `vue-final-modal`
- `TextSkeleton` (loader)
- `FetchError` (ошибка загрузки)
- `normalizeDate` (утилита форматирования даты)

## Поведение

- Рендерится как выезжающая панель справа
- При изменении `status`:
    - `idle` / `pending` > отображает loader
    - `error` > отображает ошибку
    - `success` > вставляет HTML через `v-html`
- Если передан `dateUpdated`:
    - отображает форматированную дату
- Закрытие:
    - по кнопке (emit `close`)
    - по свайпу (встроено в `vue-final-modal`)

## Особенности рендера контента

- Поддерживает HTML-разметку:
    - заголовки (`h2–h6`) с offset для якорей
    - списки (`ul`, `ol`)
    - таблицы
    - изображения / видео
    - ссылки
    - разделители (`hr`)
- Контент полностью контролируется извне (через `content`)

## Пример использования

```vue
<template>
	<div v-if="docs && docs.length" class="some-wrapper">
		<button
			v-for="(doc, idx) in docs"
			:key="idx"
			@click="
				openPolicy({
					title: doc.title,
					date: doc.date_updated ?? doc.date_created,
					innerContent: doc.content,
				})
			">
			{{ doc.title }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { ModalsDocs } from '#components';
import { useModal } from 'vue-final-modal';
import type { IPolicy } from '~/types/policy';

const { content: docs, status: docsStatus } = await useCms<IPolicy[]>('docs', [], { lazy: false }, { query: { filter: { published: { _eq: true } } } });

function openPolicy(input: { title: string; date: string; innerContent: string }) {
	const { open: _open, close: _close } = useModal({
		component: ModalsDocs,
		attrs: {
			status: docsStatus.value,
			title: input.title,
			dateUpdated: input.date,
			content: input.innerContent,
			onClose() {
				_close();
			},
		},
	});
	_open();
}
</script>
```
