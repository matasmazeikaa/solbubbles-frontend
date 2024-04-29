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
import { useGame } from "@/hooks/useGame";
import { computed, ref } from "vue";
import Button from "./Button.vue";

const { lastActionTick } = useGame();

const cashOutButton = ref();

const emits = defineEmits(["cash-out"]);

const buttonTitle = computed(
  () => `Cashout ${lastActionTick.value <= 0 ? "" : lastActionTick.value}`
);

const isCashoutDisabled = computed(() => {
  return lastActionTick.value <= 0 ? false : true;
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
