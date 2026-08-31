import { useVfm } from 'vue-final-modal';

export default defineNuxtPlugin(() => {
    const router = useRouter();

    router.beforeEach((to, from) => {
        if (to.path !== from.path) {
            const { closeAll } = useVfm();
            closeAll();
        }
    });
});
