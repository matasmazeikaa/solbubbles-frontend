<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade">
      <Component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
import { useAppStore } from "./stores/appStore";

const appStore = useAppStore();

appStore.initApp();
</script>

<style>
#app {
  height: 100vh;
}
</style>
