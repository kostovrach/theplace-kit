<template>
    <button
        v-bind="{ ...$attrs }"
        type="button"
        :id="item.triggerId"
        :data-state="isOpen ? 'open' : 'closed'"
        :data-disabled="isDisabled ? '' : undefined"
        :aria-expanded="isOpen"
        :aria-controls="item.contentId"
        :disabled="isDisabled"
        :class="['spoiler-head', props.class]"
        @click="item.toggle"
    >
        <slot :open="isOpen" :disabled="isDisabled" :toggle="item.toggle"></slot>
    </button>
</template>

<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            class?: string | Record<string, unknown>;
        }>(),
        {
            class: '',
        }
    );

    const item = inject(SpoilerItemContextKey);

    if (!item) {
        throw new Error('[SpoilerHead] must be used inside <SpoilerItem> component');
    }

    const isOpen = computed(() => item.isOpen.value);
    const isDisabled = computed(() => item.isDisabled.value);
</script>
