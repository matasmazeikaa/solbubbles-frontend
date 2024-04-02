<template>
  <Transition name="fade">
    <div v-if="isGameControlsVisible" class="game-controls">
      <h1>Controls:</h1>
      <h2>"Space" - Split</h2>
      <h2>"w" - Fire food</h2>
      <h2>"q" - Cash out</h2>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface Props {
  isReconnected: boolean;
}

const props = defineProps<Props>();

const isGameControlsVisible = ref(!props.isReconnected);

// show how to play modal for 5s
setTimeout(() => {
  isGameControlsVisible.value = false;
}, 5000);
</script>

<style lang="scss">
.game-controls {
  background-color: #161521cc;
  padding: 4.2rem;
  position: absolute;
  top: 4rem;
  z-index: 10;
  border-radius: 1.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  // center screen absolute
  left: 50%;
  transform: translateX(-50%);
}
</style>
