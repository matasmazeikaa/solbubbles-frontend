<script lang="ts" setup>
import type { Wallet } from "@/types";

interface Props {
  wallet: Wallet | undefined;
}

defineProps<Props>();
</script>

<template>
  <i class="swv-button-icon">
    <img
      v-if="wallet"
      :src="wallet.adapter.icon"
      :alt="`${wallet.adapter.name} icon`"
    />
  </i>
</template>
