<template>
    <div id="cookie" class="cookie-notify" v-if="isShowNotify">
        <div class="cookie-notify__container">
            <div class="cookie-notify__title">
                <SvgSprite type="common-cookie" :size="22" />
                <span>Мы&nbsp;используем файлы cookie</span>
            </div>

            <div class="cookie-notify__content">
                Продолжая использовать сайт, вы&nbsp;предоставляете согласие на&nbsp; обработку
                персональных данных с&nbsp;помощью сервисов веб-аналитики.
            </div>

            <button is="button" chip class="cookie-notify__button" @click="setAgreement">
                Принять
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    const isShowNotify = ref(false);

    const setAgreement = () => {
        if (!localStorage.getItem('cookie-accepted')) {
            localStorage.setItem('cookie-accepted', 'true');
            isShowNotify.value = false;
        } else isShowNotify.value = false;
    };

    onMounted(() => {
        if (localStorage.getItem('cookie-accepted')) {
            return;
        } else {
            isShowNotify.value = true;
        }
    });
</script>

<style scoped lang="scss">
    @use '~/assets/scss/abstracts' as *;

    .cookie-notify {
        position: fixed;
        z-index: 10;
        left: lineScale(16, 8, 480, 1920);
        bottom: lineScale(48, 16, 480, 1920);
        width: calc(100% - lineScale(32, 16, 480, 1920));
        max-width: rem(440);
        box-sizing: border-box;
        color: $c-secondary;
        background-color: $c-main;
        border-radius: rem(6);
        border-left: rem(5) solid $c-accent;
        animation: cookie-toast $td $tf;
        @keyframes cookie-toast {
            from {
                translate: 0 100%;
            }
            to {
                translate: 0 0;
            }
        }
        &__container {
            display: flex;
            flex-direction: column;
            gap: rem(16);
            padding: rem(16);
        }
        &__title {
            display: flex;
            align-items: center;
            gap: rem(8);
            font-size: rem(15);
            &-icon {
                color: $c-accent;
            }
        }
        &__content {
            cursor: default;
            text-wrap: balance;
            font-size: rem(12);
            line-height: 1.6;
        }
        &__button {
            cursor: pointer;
            align-self: flex-end;
        }
    }
</style>
