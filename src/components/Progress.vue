<template>
  <div class="progress">
    <div
      class="progress__bar"
      ref="progressRef"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { logarithmicRest } from "@/utils/math";

const props = defineProps({
  progress: {
    default: {
      endTime: Date.now() + 120,
      startTime: Date.now(),
    },
  },
  done: Boolean,
  expiresIn: {
    default: 10 * 60,
    type: Number,
  },
});

const totalSeconds = props.progress
  ? props.progress.endTime - props.progress.startTime
  : 0;

const interval = ref();
const percentRemaining = ref(100);
const progressRef = ref();

const updateProgressBar = () => {
  if (!progressRef.value) {
    return;
  }

  progressRef.value.style.width = `${percentRemaining.value}%`;
  progressRef.value.ariaValueNow = percentRemaining.value;
};

const setPercentRemaining = (value: number) => {
  percentRemaining.value = value;
  updateProgressBar();
};

const handleRunningProgress = () => {
  const MAX_PERCENT = 90;

  interval.value = setInterval(() => {
    const decrement =
      percentRemaining.value > 100 - MAX_PERCENT
        ? 1
        : logarithmicRest(percentRemaining.value);

    const value = percentRemaining.value - decrement;

    setPercentRemaining(value);
  }, 400);
};

watch(
  () => props.done,
  (newDone) => {
    if (newDone) {
      setPercentRemaining(0);
      clearInterval(interval.value);
    }
  }
);

handleRunningProgress();

onBeforeUnmount(() => {
  clearInterval(interval.value);
});
</script>

<style lang="scss" scoped>
.progress {
  position: relative;
  height: 100%;
  width: 100%;

  &__bar {
    position: absolute;
    pointer-events: none;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: linear-gradient(90deg, #161521 0%, #9381ff 100%);
    opacity: 0.5;
    transition: width 0.6s ease;
  }
}
</style>
