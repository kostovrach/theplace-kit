<template>
    <VueFinalModal
        overlay-transition="vfm-fade"
        content-transition="vfm-slide-right"
        swipe-to-close="right"
    >
        <div class="modal-menu">
            <div class="modal-menu__container">
                <div class="modal-menu__header">
                    <button class="modal-menu__button" type="button" @click="emit('close')">
                        <SvgSprite type="cross" :size="32" />
                    </button>
                </div>
            </div>
        </div>
    </VueFinalModal>
</template>

<script setup lang="ts">
    import { VueFinalModal } from 'vue-final-modal';

    const emit = defineEmits<{
        (e: 'close'): void;
    }>();
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .modal-menu {
        $p: &;
        $px: rem(32);

        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        max-width: rem(540);
        height: 100vh;
    }
</style>
