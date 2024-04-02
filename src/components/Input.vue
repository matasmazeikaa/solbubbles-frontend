<template>
  <div class="input">
    <input
      @input="handleInput"
      @keydown="handleValidation"
      :value="modelValue"
    />
    <button
      class="input__select-all small small--bold"
      @click="$emit('select-all')"
      v-if="isSelectAll"
    >
      Select all
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["update:modelValue", "select-all"]);
const props = defineProps({
  modelValue: [String, Number],
  type: {
    default: "text",
  },
  isSelectAll: {
    type: Boolean,
    default: false,
  },
});

const sanitizeOnlyNumber = (event: Event) => {
  const element = event.currentTarget as HTMLInputElement;

  element.value = element.value
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*?)\..*/g, "$1")
    .replace(/^0[^.]/, "0");
};

const handleInput = (event: Event) => {
  const element = event.currentTarget as HTMLInputElement;

  if (props.type === "number") {
    sanitizeOnlyNumber(event);

    emit(
      "update:modelValue",
      element.value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1")
        .replace(/^0[^.]/, "0")
    );

    return;
  }

  emit("update:modelValue", element.value);
};

const handleValidation = (event: Event) => {
  if (props.type === "number") {
    sanitizeOnlyNumber(event);
  }
};
</script>

<style scoped lang="scss">
.input {
  width: 100%;
  position: relative;

  &__select-all {
    color: $primary-color;
    background: none;
    cursor: pointer;
    right: 2.4rem;
    top: 1.6rem;
    position: absolute;
    transition: opacity 0.1s ease-in-out;

    &:hover {
      opacity: 0.75;
    }
  }

  input {
    width: 100%;
    border: 1px solid #202230;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.6rem 1.6rem 1.6rem 2.4rem;
    border-radius: 10rem;
    font-weight: 500;
    background-color: transparent;
  }
}
</style>
