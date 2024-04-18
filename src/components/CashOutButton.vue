<template>
  <Button
    class="button"
    :title="buttonTitle"
    :is-disabled="!lastActionTick || isCashoutDisabled"
    :class="{ 'button--disabled': isCashoutDisabled }"
    ref="cashOutButton"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { GameConfig } from "@/config/game";
import { useGame } from "@/hooks/useGame";
import { computed, ref, watch } from "vue";
import Button from "./Button.vue";

const { lastActionTick } = useGame();

const cashOutButton = ref();

const emits = defineEmits(["cash-out"]);

const timer = ref<null | number>(GameConfig.cashoutCooldown);

const buttonTitle = computed(() => `Cashout ${timer.value ?? ""}`);

const getLastActionSecondsDiff = () => {
  if (!lastActionTick.value) {
    return 0;
  }

  const startDate = new Date(lastActionTick.value).getTime();
  const endDate = new Date().getTime();
  const diff = endDate - startDate;
  const seconds = Math.floor((diff / 1000) % 60);

  return seconds;
};

const isCashoutDisabled = computed(() => {
  if (timer.value === null) {
    return false;
  }

  return timer.value <= 0 ? false : true;
});

const handleClick = (
  event: CustomEvent<HTMLButtonElement | HTMLAnchorElement>
) => {
  if (isCashoutDisabled.value || !event.target) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore:next-line
  event.target.blur();
  emits("cash-out");
};

const startTicker = () => {
  const ticker = setInterval(() => {
    if (!lastActionTick.value) {
      return;
    }

    timer.value = GameConfig.cashoutCooldown - getLastActionSecondsDiff();

    if (timer.value <= 0) {
      timer.value = null;
      window.clearInterval(ticker);
    }
  }, 1000);
};

startTicker();

watch(
  () => lastActionTick.value,
  () => {
    startTicker();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.button {
  margin: 1rem;
  min-width: 20rem;
  width: 22rem;
  font-size: 2rem;

  &--disabled {
    opacity: 0.5;

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
