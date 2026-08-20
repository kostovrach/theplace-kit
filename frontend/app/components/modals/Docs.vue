<template>
    <VueFinalModal
        overlay-transition="vfm-fade"
        content-transition="vfm-slide-right"
        swipe-to-close="right"
    >
        <div class="modal-docs">
            <div class="modal-docs__container">
                <button class="modal-docs__button" type="button" @click="emit('close')">
                    <SvgSprite type="common-cross" :size="32" />
                </button>
                <div class="modal-docs__titlebox">
                    <h1 class="modal-docs__title">{{ props.title }}</h1>
                    <span v-if="props.dateUpdated" class="modal-docs__tag">
                        Последнее обновление: {{ normalizeDate(props.dateUpdated) }}
                    </span>
                </div>
                <div class="modal-docs__body">
                    <div
                        v-show="status === 'idle' || status === 'pending'"
                        class="modal-docs__loader"
                    >
                        <TextSkeleton />
                    </div>
                    <div v-show="status === 'error'" class="modal-docs__error">
                        <FetchError />
                    </div>
                    <div
                        v-show="status === 'success'"
                        class="modal-docs__content"
                        v-html="props.content"
                    ></div>
                </div>
            </div>
        </div>
    </VueFinalModal>
</template>

<script setup lang="ts">
    import type { AsyncDataRequestStatus } from '#app';
    import { VueFinalModal } from 'vue-final-modal';

    const props = withDefaults(
        defineProps<{
            title: string;
            dateUpdated: string;
            content: string;
            status: AsyncDataRequestStatus;
        }>(),
        {
            title: '',
            dateUpdated: '',
            content: '',
            status: 'idle',
        }
    );

    const status = computed(() => props.status);

    const emit = defineEmits<{
        (e: 'close'): void;
    }>();
</script>

<style lang="scss" scoped>
    @use '~/assets/scss/abstracts' as *;

    .modal-docs {
        $p: &;

        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        max-width: rem(800);
        height: 100lvh;
        color: $c-FFFFFF;
        background-color: $c-secondary;
        overflow-y: auto;
        @include hide-scrollbar;
        &__container {
            display: flex;
            flex-direction: column;
            padding: rem(32) 0 lineScale(96, 128, 480, 1920);
        }
        &__button {
            cursor: pointer;
            align-self: flex-end;
            transition: rotate $td $tf-spring;
            margin-right: lineScale(64, 16, 480, 1920);
            @media (pointer: fine) {
                &:hover {
                    rotate: 90deg;
                }
            }
        }
        &__titlebox {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: rem(32);
            padding: 0 lineScale(64, 16, 480, 1920);
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: lineScale(16, 2, 480, 1920);
                height: rem(128);
                background-color: $c-accent;
                pointer-events: none;
            }
        }
        &__title {
            font-size: lineScale(64, 32, 480, 1920);
            font-weight: $fw-semi;
        }
        &__tag {
            font-size: lineScale(17, 15, 480, 1920);
            color: $c-accent;
            opacity: 0.5;
        }
        &__body {
            margin-top: rem(64);
            padding: 0 lineScale(64, 16, 480, 1920);
        }
        &__content:deep() {
            @include text-content;
        }
    }
</style>
