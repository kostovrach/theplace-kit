<template>
    <Lightbox
        v-if="isImage || isVideo"
        v-bind="{ ...$attrs }"
        :is="props.is"
        :class="['media', props.class]"
    >
        <template v-if="isImage">
            <component
                :is="props.lightbox ? LightboxTrigger : 'picture'"
                :hashKey="props.lightbox ? props.lightboxKey : undefined"
                :source="props.lightbox ? assetUrl : undefined"
                class="media__container"
            >
                <img
                    v-bind="{ ...props.imgAttrs }"
                    :src="assetUrl"
                    :style="{ objectFit: props.fit }"
                    class="media__content"
                />
            </component>
        </template>
        <template v-else-if="isVideo">
            <component
                :is="props.lightbox ? LightboxTrigger : 'div'"
                :hashKey="props.lightbox ? props.lightboxKey : undefined"
                :source="props.lightbox ? assetUrl : undefined"
                class="media__container"
            >
                <video
                    v-bind="{ ...props.videoAttrs }"
                    :style="{ objectFit: props.fit }"
                    class="media__content"
                >
                    <source :src="assetUrl" :type="props.file.type ?? 'video/mp4'" />
                </video>
            </component>
        </template>
    </Lightbox>
</template>

<script setup lang="ts">
    import { LightboxTrigger } from '#components';
    import type { ImgHTMLAttributes, VideoHTMLAttributes } from 'vue';

    const props = withDefaults(
        defineProps<{
            /**
             * Файл Directus для отображения.
             *
             * MIME-тип файла определяет используемый HTML-элемент:
             * `img` для изображений и `video` для видео.
             *
             * @info
             * В случае, если MIME-тип переданного файла не соответсвует
             * `image` или `video` - компонент не рендерится
             */
            file: DirectusFile;

            /**
             * HTML-тег корневого элемента компонента.
             *
             * @default 'div'
             */
            is?: keyof HTMLElementTagNameMap;

            /**
             * Addition CSS class
             */
            class?: string | Record<string, unknown> | string[];

            /**
             * Поддержка открытия в Lightbox.
             *
             * При включении медиа-контент оборачивается в `LightboxTrigger`.
             *
             * @default false
             */
            lightbox?: boolean;

            /**
             * Хэш-ключ для навигации внутри Lightbox.
             *
             * @default ''
             */
            lightboxKey?: string;

            /**
             * Режим масштабирования.
             *
             * Значение передаётся в CSS-свойство `object-fit`.
             *
             * @default 'cover'
             */
            fit?: 'cover' | 'contain' | 'scale-down' | 'fill' | 'none';

            /**
             * Дополнительные атрибуты HTML-элемента `video`.
             *
             * Атрибуты `src`, `class` и `style` исключены, поскольку
             * формируются самим компонентом.
             */
            videoAttrs?: Omit<VideoHTMLAttributes, 'src' | 'class' | 'style'>;

            /**
             * Дополнительные атрибуты HTML-элемента `img`.
             *
             * Атрибуты `src`, `class` и `style` исключены, поскольку
             * формируются самим компонентом.
             */
            imgAttrs?: Omit<ImgHTMLAttributes, 'src' | 'class' | 'style'>;

            /**
             * Параметры трансформации и получения ассета Directus.
             *
             * Значения преобразуются в query-параметры URL ассета.
             */
            query?: AssetQuery;

            /**
             * Дополнительные параметры формирования URL ассета
             *
             * @info
             * `options.filename` активен по умолчанию. Его можно только переопределить передав строку
             */
            options?: AssetOptions;
        }>(),
        {
            is: 'div',
            lightbox: false,
            fit: 'cover',
            lightboxKey: '',
            query: () => ({}),
            options: () => ({}),
        }
    );

    const assetUrl = computed(
        () =>
            getAssetUrl(props.file, props.query, {
                ...props.options,
                filename: props.options.filename ? props.options.filename : true,
            }) ?? ''
    );

    const isImage = computed(() => {
        return props.file.type?.startsWith('image/');
    });

    const isVideo = computed(() => {
        return props.file.type?.startsWith('video/');
    });
</script>

<style scoped lang="scss">
    .media {
        &__container {
            display: block;
            width: 100%;
            height: 100%;
        }
        &__content {
            width: 100%;
            height: 100%;
        }
    }
</style>
