<template>
  <div
    class="transaction-toast"
    :class="{
      'transaction-toast--active': transactionStore.latestTransaction,
    }"
  >
    <Progress
      v-if="transactionStore.latestTransaction"
      :done="transactionStore.latestTransaction.status === 'completed'"
    />
    <div class="transaction-toast__status">
      <span
        class="transaction-toast__status-pill mb-8"
        :class="{
          'transaction-toast__status-pill--success':
            transactionStore.latestTransaction?.status === 'completed',
          'transaction-toast__status-pill--pending':
            transactionStore.latestTransaction?.status === 'processing',
        }"
      >
        {{ transactionStore.latestTransaction?.status.toUpperCase() }}
      </span>
      <div class="transaction-toast__hash-container">
        <p class="small">Transaction hash:</p>
        <a
          :href="transactionLink"
          target="_blank"
          class="transaction-toast__transaction-link"
        >
          <div class="flex">
            <p class="mr-8">{{ transactionSignatureFormated }}</p>
            <SearchIcon />
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTransactionStore } from "@/stores/transactionStore";
import SearchIcon from "@/assets/search-icon.svg?component";
import Progress from "@/components/Progress.vue";
import { computed } from "vue";
import { formatAddress } from "@/utils/format";
import { processTransactionApi } from "@/api/TransactionApi";

const transactionStore = useTransactionStore();

const transactionSignatureFormated = computed(() =>
  formatAddress(transactionStore.latestTransaction?.signature || "", 12)
);

const transactionLink = computed(
  () =>
    `https://explorer.solana.com/tx/${
      transactionStore.latestTransaction?.signature
    }?cluster=${import.meta.env.VITE_SOLANA_NETWORK}`
);

(() => {
  if (transactionStore.latestTransaction) {
    processTransactionApi(transactionStore.latestTransaction.signature);

    transactionStore.pollTransactionUntillFound(
      transactionStore.latestTransaction.signature
    );
  }
})();
</script>

<style lang="scss" scoped>
.transaction-toast {
  min-width: 40rem;
  max-width: 40rem;
  height: 12rem;
  overflow: hidden;
  border-radius: 1rem;
  position: fixed;
  right: 0;
  top: $header-height + 1rem;
  background-color: $background-color;
  z-index: 12;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(100%);
  transition: all 0.5s ease;

  &--active {
    transform: translateX(-5%);
  }

  &__status {
    color: white;
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    padding: 2.4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__status-pill {
    font-weight: 500;
    padding: 0.4rem 3.8rem;
    border-radius: 40px;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;

    &--pending {
      background: #111019;
    }

    &--success {
      background: rgb(23, 39, 0);
    }

    &--fail {
      background: red;
    }
  }

  &__hash-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__transaction-link {
    display: flex;
    transition: opacity 0.1s ease-in-out;

    &::hover {
      opacity: 0.5;
    }
  }
}
</style>
