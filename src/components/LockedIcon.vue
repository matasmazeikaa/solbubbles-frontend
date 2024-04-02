<template>
  <div class="locked-icon">
    <LockIcon />
  </div>
</template>

<script lang="ts" setup>
import LockIcon from "@/assets/lock-icon.svg?component";
</script>

<style lang="scss" scoped>
.locked-icon {
  height: 4rem;
  width: 4rem;
  border-radius: 10rem;
  padding: 1.2rem;
  background-color: $background-secondary-color;
  display: flex;
}
</style>
