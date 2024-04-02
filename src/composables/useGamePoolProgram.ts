import { useNetworkStore } from "@/stores/networkStore";
import { useWalletStore } from "@/stores/walletStore";
import {
  AnchorProvider,
  BN,
  Idl,
  Program,
  setProvider,
  web3,
} from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { computed, watch } from "vue";
import gamePoolProgramIdl from "@/anchorProgramIdl/gamePoolIdl.json";
import { LAMPORTS_PER_TOKEN, useBalanceStore } from "@/stores/balanceStore";
import { TOKEN_CONFIG } from "@/constants";
import type { GamePool } from "@/anchorProgramIdl/gamePoolIdlTypes";
import { useTransactionStore } from "@/stores/transactionStore";
import { useToast } from "vue-toast-notification";
import {
  processTransactionApi,
  signWithdrawTransactionUserApi,
} from "@/api/TransactionApi";
import type { AxiosError } from "axios";

const gamePoolAuthorityPublicKey = new PublicKey(
  "zajXzoRcXiqHm3offGSYdBiicjBAnBwA3Zz9c4ND4uU"
);

export const useGamePoolProgram = () => {
  const walletStore = useWalletStore();
  const networkStore = useNetworkStore();
  const balanceStore = useBalanceStore();
  const transactionStore = useTransactionStore();
  const toast = useToast();

  const gamePoolATA = computed(() => {
    return getAssociatedTokenAddressSync(
      TOKEN_CONFIG.MINT_PUBLIC_KEY,
      gamePoolAuthorityPublicKey
    );
  });

  const gamePoolAccountPDA = computed(() => {
    const [gamePoolAccountPDA, bump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("game_pool_account")],
      programId.value
    );

    return gamePoolAccountPDA;
  });

  const provider = computed(() => {
    if (!walletStore.anchorWallet) {
      return null;
    }

    return new AnchorProvider(
      networkStore.connection,
      walletStore.anchorWallet,
      {
        preflightCommitment: "processed",
      }
    );
  });

  const programId = computed(
    () => new PublicKey(gamePoolProgramIdl.metadata.address)
  );

  const getProgram = () => {
    return new Program(
      gamePoolProgramIdl as Idl,
      programId.value
    ) as unknown as Program<GamePool>;
  };

  const processTransaction = async ({
    transactionHash,
    splTokens,
  }: {
    transactionHash: string;
    splTokens: BN;
  }) => {
    if (!walletStore.wallet?.adapter.publicKey) {
      return;
    }

    processTransactionApi(transactionHash);

    transactionStore.addProcessingTransaction(transactionHash);
  };

  const depositSplTokens = async (amount: number) => {
    if (
      !walletStore.wallet?.adapter.publicKey ||
      !walletStore.signTransaction
    ) {
      return;
    }

    try {
      const splTokens = new BN(amount * LAMPORTS_PER_TOKEN);

      const transactionHash = await getProgram()
        .methods.depositSplTokens(splTokens)
        .accounts({
          gamePoolAta: gamePoolATA.value,
          userAta: balanceStore.userATA,
          user: walletStore.wallet.adapter.publicKey,
          gamePoolAccount: gamePoolAccountPDA.value,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc({ commitment: "processed" });

      if (!transactionHash) {
        toast.error("Something went wrong while depositing, please try again");

        return;
      }

      processTransaction({ transactionHash, splTokens });
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const withdrawSplTokens = async (amount: number) => {
    if (
      !walletStore.wallet?.adapter.publicKey ||
      !walletStore.signTransaction
    ) {
      return;
    }

    const splTokens = new BN(amount * LAMPORTS_PER_TOKEN);

    try {
      const transaction = await getProgram()
        .methods.withdrawSplTokens(splTokens)
        .accounts({
          gamePoolAta: gamePoolATA.value,
          userAta: balanceStore.userATA,
          gamePoolAccount: gamePoolAccountPDA.value,
          tokenProgram: TOKEN_PROGRAM_ID,
          authority: gamePoolAuthorityPublicKey,
        })
        .transaction();

      const latestBlockHash =
        await networkStore.connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockHash.blockhash;
      transaction.feePayer = walletStore.wallet.adapter.publicKey;

      const serialise = transaction.serialize({
        requireAllSignatures: false,
      });

      console.log(serialise.toJSON());
      console.log(Transaction.from(serialise));

      try {
        const { data } = await signWithdrawTransactionUserApi({
          rawTransaction: JSON.stringify(serialise.toJSON().data),
          splLamportsWithdrawAmount: amount * LAMPORTS_PER_TOKEN,
        });

        console.log(data.transactionBuffer);

        const deserialiseSignedTransaction = Transaction.from(
          JSON.parse(data.transactionBuffer)
        );

        const userSignedTransaction = await walletStore.signTransaction(
          deserialiseSignedTransaction
        );

        const rawTransaction = userSignedTransaction.serialize();

        const transactionHash =
          await networkStore.connection.sendRawTransaction(rawTransaction);

        if (!transactionHash) {
          toast.error(
            "Something went wrong while withdrawing, please try again"
          );

          return;
        }

        await processTransaction({ transactionHash, splTokens });
      } catch (error) {
        const errorMessage =
          (
            error as AxiosError<{
              errorMessage: string;
            }>
          ).response?.data?.errorMessage ||
          "Something went wrong while withdrawing";

        toast.error(errorMessage);

        throw new Error(errorMessage);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  };

  watch(
    () => provider.value,
    (provider) => {
      if (!provider) {
        return;
      }

      setProvider(provider);
    },
    { deep: true, immediate: true }
  );

  return {
    depositSplTokens,
    withdrawSplTokens,
  };
};
