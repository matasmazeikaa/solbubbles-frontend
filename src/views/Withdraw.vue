<template>
  <FunctionalBox
    title="Withdraw"
    @close="$router.push({ name: 'lobby' })"
    class="withdraw"
  >
    <div class="withdraw__amount-container mb-16">
      <span class="small small--bold">Game balance:</span>
      <Tokens
        :lamports="balanceStore.depositedTokenBalance.amount"
        class="label label--bold"
      />
    </div>
    <div class="withdraw__amount-container mb-16">
      <span class="small small--bold">Available balance:</span>
      <Tokens
        :lamports="balanceStore.tokenBalance.amount"
        class="label label--bold"
      />
    </div>
    <Input
      class="mb-24 width-100"
      v-model.number="withdrawAmount"
      is-select-all
      @select-all="selectAll"
      type="number"
    />
    <ButtonSpinningPender
      title="Withdraw"
      class="width-100"
      @click="handleWithdraw"
      :is-initiated="isInitiatedWithdraw"
      :status="transactionStore.latestTransaction?.status"
    />
  </FunctionalBox>
</template>

<script lang="ts" setup>
import FunctionalBox from "@/components/FunctionalBox.vue";
import Input from "@/components/Input.vue";
import { ref } from "vue";
import { useToast } from "vue-toast-notification";
import ButtonSpinningPender from "@/components/ButtonSpinningPender.vue";
import { useGamePoolProgram } from "@/composables/useGamePoolProgram";
import { LAMPORTS_PER_TOKEN, useBalanceStore } from "@/stores/balanceStore";
import { useTransactionStore } from "@/stores/transactionStore";
import Tokens from "@/components/Tokens.vue";

const { withdrawSplTokens } = useGamePoolProgram();
const toast = useToast();
const balanceStore = useBalanceStore();
const transactionStore = useTransactionStore();

const withdrawAmount = ref();

const isInitiatedWithdraw = ref(false);

// const { formatedDepositedBalance, depositedBalance } = storeToRefs(userStore);

const selectAll = () => {
  withdrawAmount.value = balanceStore.depositedTokenBalance.uiAmount;
};

const handleWithdraw = async () => {
  // if (!withdrawAmount.value) {
  //   return toast.error("Please enter a valid amount");
  // }

  // const lamportsAmount = withdrawAmount.value * LAMPORTS_PER_TOKEN;

  // if (lamportsAmount > Number(balanceStore.depositedTokenBalance.amount)) {
  //   return toast.error("Your balance is not enough");
  // }

  try {
    isInitiatedWithdraw.value = true;
    await withdrawSplTokens(withdrawAmount.value);

    withdrawAmount.value = undefined;
  } finally {
    isInitiatedWithdraw.value = false;
  }
};
</script>

<style lang="scss" scoped>
.withdraw {
  max-width: 40rem;
  width: auto;
  margin: 0 auto;

  &__amount-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
