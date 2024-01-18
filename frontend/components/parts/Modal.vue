<template>
  <n-modal
    v-bind="$attrs"
    :title="title"
    :class="{ fullscreen: fullscreen }"
    :preset="fullscreen ? 'card' : 'dialog'"
    :bordered="false"
    :show-icon="false"
    @after-leave="$emit('close')"
  >
    <slot />
  </n-modal>
</template>

<script lang="ts" setup>
defineProps({
  fullscreen: { type: Boolean, default: false },
  title: { type: String, default: null },
});
defineEmits(['close']);
</script>
