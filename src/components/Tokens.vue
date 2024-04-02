<template>
  <p>{{ formattedTokens }}</p>
</template>

<script lang="ts" setup>
import { TOKEN_CONFIG } from "@/constants";
import { roundTo, roundTokensFromLamports } from "@/utils/format";
import { computed } from "vue";

interface Props {
  lamports?: number | string;
  tokens?: string | number | null;
}

const props = defineProps<Props>();

const formattedTokens = computed(() =>
  props.tokens
    ? `${roundTo(props.tokens, 2)} ${TOKEN_CONFIG.LABEL}`
    : `${roundTokensFromLamports(Number(props.lamports))} ${TOKEN_CONFIG.LABEL}`
);
</script>
