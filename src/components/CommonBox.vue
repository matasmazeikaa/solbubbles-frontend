<template>
  <Box class="modal__content">
    <span class="modal__close" @click="$emit('close')">&times;</span>
    <h2>{{ title }}</h2>
    <slot />
  </Box>
</template>

<script lang="ts" setup>
import Box from "@/components/Box.vue";

defineProps({
  title: String,
});
</script>

<style lang="scss" scoped>
/* The Modal (background) */
.modal {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

  &__content {
    width: 100%;
    max-width: 60rem;
    height: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: $background-color;
  }

  &__close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;

    &::hover,
    &::focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  }
}

/* The Close Button */
</style>
