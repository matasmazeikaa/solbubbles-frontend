<template>
  <div class="ping">
    <label class="mr-8">Ping {{ ping }}</label>
    <div class="ping__circle" :class="[`ping__circle--${pingStatus}`]" />
  </div>
</template>

<script lang="ts" setup>
import { useGame } from "@/hooks/useGame";
import { computed } from "vue";

const { game } = useGame();

const PING_STATUS = {
  GOOD: "good",
  AVERAGE: "average",
  BAD: "bad",
};

const PING_NUMBER_STATUS = {
  [PING_STATUS.GOOD]: 50,
  [PING_STATUS.BAD]: 150,
};

const ping = computed(() => game.value?.ping ?? 0);

const pingStatus = computed(() => {
  if (ping.value < PING_NUMBER_STATUS[PING_STATUS.GOOD]) {
    return PING_STATUS.GOOD;
  }

  if (
    ping.value > PING_NUMBER_STATUS[PING_STATUS.GOOD] &&
    ping.value < PING_NUMBER_STATUS[PING_STATUS.BAD]
  ) {
    return PING_STATUS.AVERAGE;
  }

  if (ping.value > 150) {
    return PING_NUMBER_STATUS[PING_STATUS.BAD];
  }

  return PING_NUMBER_STATUS[PING_STATUS.GOOD];
});
</script>

<style lang="scss" scoped>
.ping {
  display: flex;
  align-items: center;
  margin-left: auto;

  &__circle {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;

    &--good {
      background: #00ff00;
    }

    &--average {
      background: orange;
    }

    &--bad {
      background: red;
    }
  }
}
</style>
