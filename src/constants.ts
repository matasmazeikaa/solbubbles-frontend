import { PublicKey } from "@solana/web3.js";

export const KEY = {
  W: 87,
  SPACE: 32,
};

export const MINT_TX_BASE_GAS_LIMIT = 14000000;

export const MAX_USERS_IN_ROOM = 100;

//1 = 1^18
export const TOKEN_TO_WEI = 1000000000000000000;

export const GAME_CONFIG = {
  BACKGROUND_COLOR: "#202230",
  LINE_COLOR: "#313449",
  VIRUS_SIDES: 20,
  TOGGLE_MASS_STATE: 0,
};

export const FOOD_CONFIG = {
  BORDER: 0,
  FOOD_SIDES: 10,
};

export const PLAYER_CONFIG = {
  BORDER: 3,
  TEXT_COLOR: "#FFFFFF",
  TEXT_BORDER: "#000000",
  TEXT_BORDER_SIZE: 3,
  DEFAULT_SIZE: 30,
  CASHOUT_COOLDOWN: 1,
};

export const TRANSACTION_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAIL: "fail",
};

export const PINIA_PERSIST_STORE = {
  BALANCE: "balance-store",
  TRANSACTION: "transaction-store",
} as const;

export const TOKEN_CONFIG = {
  LABEL: "$BUBBL",
  MINT_PUBLIC_KEY: new PublicKey(
    "GMhjEWpr9YrhfrYuxzgBznE3gMh6QKscTaXCYM5kuNrK"
  ),
  // MINT_PUBLIC_KEY: new PublicKey(
  //   "HCZKay2mMWo5aqthbQmuzas2JkpvuWsjCWUbP3tEgvtF"
  // ),
  LAMPORTS_PER_TOKEN: 1000000000,
};
