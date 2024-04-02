<template>
  <FunctionalBox
    title="Request (Beta) BUBBL tokens"
    @close="$router.push({ name: 'lobby' })"
    class="deposit"
  >
    <div class="deposit__amount-container mb-16">
      <span class="small small--bold"
        >For testing purposes Solana devnet is being used and you can request
        your BETA tokens for testing by clicking Request<button></button
      ></span>
    </div>

    <div class="deposit__amount-container mb-16">
      <span class="small small--bold">
        !Important: You have to enable Devnet in your Phantom wallet
        <a
          href="https://www.blog.goosefx.io/switch-from-mainnet-to-devnet-network-on-solana/#:~:text=Changing%20Wallet%20Networks%20on%20Phantom,menu%2C%20then%20click%20Change%20Network%20."
          target="_blank"
          >See here</a
        >
      </span>
    </div>
    <ButtonSpinningPender
      title="Request"
      class="width-100"
      @click="handleRequest"
      :is-initiated="isLoading"
      :status="transactionStore.latestTransaction?.status"
    />
  </FunctionalBox>
</template>

<script lang="ts" setup>
import FunctionalBox from "@/components/FunctionalBox.vue";
import { useToast } from "vue-toast-notification";
import { ref } from "vue";
import ButtonSpinningPender from "../components/ButtonSpinningPender.vue";
import { useGamePoolProgram } from "@/composables/useGamePoolProgram";
import { useBalanceStore } from "@/stores/balanceStore";
import { TOKEN_CONFIG } from "@/constants";
import { useTransactionStore } from "@/stores/transactionStore";
import { useWalletStore } from "@/stores/walletStore";
import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { useNetworkStore } from "@/stores/networkStore";
import {
  Keypair,
  Signer,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const balanceStore = useBalanceStore();
const transactionStore = useTransactionStore();
const toast = useToast();
const walletStore = useWalletStore();
const networkStore = useNetworkStore();

const isLoading = ref(false);

const getMinthAuthority = () => {
  const secret = import.meta.env.VITE_MINT_SECRET_KEY;

  if (!secret) {
    throw new Error("Mint secret key not found");
  }

  try {
    return Keypair.fromSecretKey(new Uint8Array(JSON.parse(secret))) as Signer;
  } catch (err) {
    return undefined;
  }
};

const handleRequest = async () => {
  const DESTINATION_WALLET = walletStore.publicKey;
  const MINT_ADDRESS = TOKEN_CONFIG.MINT_PUBLIC_KEY;
  const TRANSFER_AMOUNT = 1000;

  const transferAuthority = getMinthAuthority();

  if (!transferAuthority) {
    toast.error("Mint authority not found");
    return;
  }

  if (!DESTINATION_WALLET) {
    toast.error("Destination wallet not found");
    return;
  }

  isLoading.value = true;

  const sourceAccoun = await getOrCreateAssociatedTokenAccount(
    networkStore.connection,
    transferAuthority,
    MINT_ADDRESS,
    transferAuthority.publicKey
  );

  const destinationAccount = await getOrCreateAssociatedTokenAccount(
    networkStore.connection,
    transferAuthority,
    MINT_ADDRESS,
    DESTINATION_WALLET
  );

  const tx = new Transaction().add(
    createTransferInstruction(
      sourceAccoun.address,
      destinationAccount.address,
      transferAuthority?.publicKey,
      TRANSFER_AMOUNT * TOKEN_CONFIG.LAMPORTS_PER_TOKEN
    )
  );

  const latestBlockHash = await networkStore.connection.getLatestBlockhash(
    "confirmed"
  );

  tx.recentBlockhash = await latestBlockHash.blockhash;

  const transactionHash = await sendAndConfirmTransaction(
    networkStore.connection,
    tx,
    [transferAuthority],
    { commitment: "finalized" }
  );

  console.log(transactionHash);

  await balanceStore.updateAllBalances();

  isLoading.value = false;
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
