<template>
    <VueFinalModal
        overlay-transition="vfm-fade"
        content-transition="vfm-slide-right"
        swipe-to-close="right"
    >
        <div class="modal-docs">
            <div class="modal-docs__container">
                <button class="modal-docs__button" type="button" @click="emit('close')">
                    <SvgSprite type="cross" :size="32" />
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

<style lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .modal-docs {
        $p: &;

        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        max-width: rem(800);
        height: 100lvh;
        overflow-y: auto;
        @include hide-scrollbar;
        &__container {
            display: flex;
            flex-direction: column;
            padding: rem(32);
        }
        &__button {
            align-self: flex-end;
        }
        &__titlebox {
            display: flex;
            flex-direction: column;
            gap: rem(32);
        }
        &__title {}
        &__tag {}
        &__body {
            margin-top: rem(64);
        }
        &__content {
            display: flex;
            flex-direction: column;
            h2 {
                font-size: lineScale(24, 18, 480, 1440);
                margin: rem(32) 0 rem(8);
            }
            h3,
            h4,
            h5,
            h6 {
                font-size: rem(16);
                margin: rem(24) 0 rem(8);
            }

            p {
                font-size: rem(14);
                line-height: 1.3;
                margin: rem(16) 0 rem(8);
                > a {
                    text-decoration: underline;
                    @media (pointer: fine) {
                        &:hover {
                            text-decoration: none;
                        }
                    }
                }
            }
        }
    }
</style>
