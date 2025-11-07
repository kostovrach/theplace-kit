<template>
    <header class="header">
        <div class="header__container">
            <TheHeaderBurger class="header__burger" @click="openMenu" />
            Header
        </div>
    </header>
</template>

<script setup lang="ts">
    import { ModalsSideMenu } from '#components';
    import { useModal } from 'vue-final-modal';

    // modals ==============================================================================
    const { open: openMenu, close: closeMenu } = useModal({
        component: ModalsSideMenu,
        attrs: {
            onClose() {
                closeMenu();
            },
        },
    });
    // =====================================================================================
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .header {
        $p: &;
    }
</style>
