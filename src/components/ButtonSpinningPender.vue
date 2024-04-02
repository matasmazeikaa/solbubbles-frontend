<template>
  <span class="loading-btn-wrapper">
    <Button
      class="loading-btn js_fail-animation-trigger"
      :class="{
        'loading-btn--pending':
          status === TRANSACTION_STATUS.PROCCESSING || isInitiated,
        'loading-btn--success': status === TRANSACTION_STATUS.COMPLETED,
      }"
      @click="$emit('click')"
    >
      <span class="loading-btn__text"> {{ title }} </span>
    </Button>
  </span>
</template>

<script lang="ts" setup>
import { TRANSACTION_STATUS } from "@/hooks/useLoadingTransaction";
import { watch, type PropType } from "vue";
import Button from "./Button.vue";

const TIMEOUT = 1500;

const props = defineProps({
  status: {
    type: String as PropType<string | null>,
    default: null,
  },
  title: String,
  isSuccess: Boolean,
  isFailed: Boolean,
  isLoading: Boolean,
  isInitiated: Boolean,
});

const emits = defineEmits(["click", "reset"]);

const removeStatusAfterTimeout = () => {
  setTimeout(() => {
    emits("reset");
  }, TIMEOUT);
};

watch(
  () => props.status,
  (newStatus) => {
    if (newStatus !== TRANSACTION_STATUS.PROCCESSING) {
      removeStatusAfterTimeout();
    }
  }
);
</script>

<style lang="scss" scoped>
// Config
$circle-size: 40px;

// Unfortunatly we need a wrapper element containing the fixed width for centering the button within the animtion (you could also apply the width as an inline style).
.loading-btn-wrapper {
  display: inline-block;
  min-width: 24rem;
  height: $circle-size;

  text-align: center;
}

.loading-btn {
  $root: &;

  position: relative;

  display: inline-block;
  width: 100%;
  height: 100%;
  padding: 2.4rem;

  border: 0;
  border-radius: 24px;

  cursor: pointer;

  transition: all 0.33s ease-in-out;

  &,
  &:focus {
    outline: none;
  }

  // Styles for all states
  &--pending,
  &--success,
  &--fail {
    // Morph button to circle (width equals height)
    width: $circle-size;

    // Prevent any further clicks triggering events during animation
    pointer-events: none;
    cursor: default;

    box-shadow: 0px 8px 24px 0px rgb(147 129 255 / 24%);
    transform: translateY(4px);

    // Hide text
    #{$root}__text {
      opacity: 0;
    }
  }

  // State "pending"
  // Show loading indicator
  &--pending:before {
    content: "";

    position: absolute;
    top: 50%;
    left: 50%;

    display: inline-block;

    // Can't use percentage here as we already show this icon during morph animation
    height: #{$circle-size * 0.7};
    width: #{$circle-size * 0.7};

    border: 3px solid rgba(255, 255, 255, 0.33);
    border-top-color: #fff;
    border-radius: 50%;

    animation: loading-btn--fade-in 0.33s ease,
      loading-btn--rotation 0.66s linear 0s infinite;
  }

  // Success state - show check icon
  &--success {
    // Different background color (also on hover)
    &,
    &:hover {
      background: #8bc34a;
    }

    // Use "after" pseudo to trigger new fade in animation, as "before" is already used on "--pending"
    &:after {
      content: "";

      position: absolute;
      top: 50%;
      left: 50%;

      // Simulate checkmark icon
      display: inline-block;
      height: 25%;
      width: 50%;

      border: 3px solid #fff;
      border-top-width: 0;
      border-right-width: 0;

      transform: translate(-50%, -75%) rotate(-45deg);

      animation: loading-btn--fade-in 0.6s ease;
    }
  }

  // Fail state - show cross icon
  &--fail {
    // Different background color (also on hover)
    &,
    &:hover {
      background: #ff5722;
    }

    // Use "after" pseudo to trigger new fade in animation, as "before" is already used on "--pending"
    &:after {
      content: "";

      position: absolute;
      top: 50%;
      left: 50%;

      // Simulate cross icon
      display: inline-block;
      height: 65%;
      width: 65%;

      // Using background gradient is the only solution creating a cross with a single element
      background: linear-gradient(
          to bottom,
          transparent 44%,
          #fff 44%,
          #fff 56%,
          transparent 56%
        ),
        linear-gradient(
          to right,
          transparent 44%,
          #fff 44%,
          #fff 56%,
          transparent 56%
        );

      transform: translate(-50%, -50%) rotate(-45deg);

      animation: loading-btn--fade-in 0.6s ease;
    }
  }

  // Text has to be positioned absolute in order prevent line-breaks or trimming of text when morphing button to circle.
  &__text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 600;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    font-size: 13px;
    color: #fff;

    transition: inherit;
  }
}

/**
 * Animations
 */

@keyframes loading-btn--fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes loading-btn--rotation {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/**
 * Optical stuff - has nothing todo with button animation.
 */

.state-list {
  margin-bottom: 12px;

  .loading-btn-wrapper {
    background: repeating-linear-gradient(
      45deg,
      #fff,
      #fff 10px,
      #f0f0f0 10px,
      #f0f0f0 20px
    );
  }
}

.loading-btn-wrapper {
  & + & {
    margin-left: 8px;
  }
}
</style>
