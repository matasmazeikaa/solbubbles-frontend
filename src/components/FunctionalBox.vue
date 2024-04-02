<template>
  <Box class="functional-box">
    <div class="functional-box__header">
      <h2 class="h2 mb-24">{{ title }}</h2>
      <span
        class="functional-box__close"
        @click="$emit('close')"
        v-if="isCloseVisible"
        >&times;</span
      >
    </div>
    <slot />
  </Box>
</template>

<script lang="ts" setup>
import Box from "@/components/Box.vue";

defineProps({
  title: String,
  isCloseVisible: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.functional-box {
  width: 100%;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__close {
    font-size: 2.4rem;
    cursor: pointer;
    background-color: #111019;
    line-height: 0;
    width: 4rem;
    height: 4rem;
    padding: 1.2rem;
    border-radius: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s opacity;

    &:hover {
      opacity: 0.75;
    }
  }
}
</style>
