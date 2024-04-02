<template>
  <FunctionalBox
    title="Deposit"
    @close="$router.push({ name: 'lobby' })"
    class="deposit"
  >
    <div class="deposit__amount-container mb-16">
      <span class="small small--bold">Game balance:</span>
      <Tokens
        :lamports="balanceStore.depositedTokenBalance.amount"
        class="label label--bold"
      />
    </div>
    <div class="deposit__amount-container mb-16">
      <span class="small small--bold">Available balance:</span>
      <Tokens
        :lamports="balanceStore.tokenBalance.amount"
        class="label label--bold"
      />
    </div>
    <Input
      class="mb-24 width-100"
      v-model.number="depositAmount"
      is-select-all
      @select-all="selectAll"
      type="number"
    />
    <ButtonSpinningPender
      title="Deposit"
      class="width-100"
      @click="handleTokenDeposit"
      :is-initiated="isInitiatedDeposit"
      :status="transactionStore.latestTransaction?.status"
    />
  </FunctionalBox>
</template>

<script lang="ts" setup>
import FunctionalBox from "@/components/FunctionalBox.vue";
import Input from "@/components/Input.vue";
import { useToast } from "vue-toast-notification";
import { ref } from "vue";
import ButtonSpinningPender from "../components/ButtonSpinningPender.vue";
import { useGamePoolProgram } from "@/composables/useGamePoolProgram";
import { useBalanceStore } from "@/stores/balanceStore";
import { TOKEN_CONFIG } from "@/constants";
import { useTransactionStore } from "@/stores/transactionStore";
import Tokens from "@/components/Tokens.vue";

const balanceStore = useBalanceStore();
const transactionStore = useTransactionStore();
const toast = useToast();
const depositAmount = ref();

const isInitiatedDeposit = ref(false);
const { depositSplTokens } = useGamePoolProgram();

const selectAll = () => {
  depositAmount.value = balanceStore.tokenBalance.uiAmount;
};

const handleTokenDeposit = async () => {
  if (!depositAmount.value) {
    toast.error("Please enter a valid amount");

    return;
  }

  const splTokens = depositAmount.value * TOKEN_CONFIG.LAMPORTS_PER_TOKEN;

  if (splTokens > Number(balanceStore.tokenBalance.amount)) {
    toast.error("Balance too low, buy more $BUBBL or send from another wallet");

    return;
  }

  try {
    isInitiatedDeposit.value = true;
    await depositSplTokens(depositAmount.value);
    isInitiatedDeposit.value = false;

    depositAmount.value = undefined;
  } catch (error) {
    console.log(error);
    isInitiatedDeposit.value = false;
    toast.error("Token depositing failed");
  }
};
</script>

<style lang="scss" scoped>
.deposit {
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
