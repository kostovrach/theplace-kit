<template>
    <header class="header">
        <div class="header__container">
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
    .header {
        $p: &;
    }
</style>
