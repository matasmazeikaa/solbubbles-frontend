import Lobby from "@/views/Lobby.vue";
import { createRouter, createWebHistory } from "vue-router";
import Withdraw from "@/views/Withdraw.vue";
import Deposit from "@/views/Deposit.vue";
import RequestBetaTokens from "@/views/RequestBetaTokens.vue";

export const LOBBY_ROUTE = "/";
export const GAME_ROUTE = "/game";

const ROUTE = {
  LOBBY: {
    PATH: "/",
    NAME: "lobby",
  },
  WITHDRAW: {
    PATH: "withdraw",
    NAME: "withdraw",
  },
  DEPOSIT: {
    PATH: "deposit",
    NAME: "deposit",
  },
  REQUEST_BETA_TOKENS: {
    PATH: "beta-tokens",
    NAME: "beta-tokens",
  },
} as const;

export type RouteNames = typeof ROUTE[keyof typeof ROUTE]["NAME"];
export type RoutePaths = typeof ROUTE[keyof typeof ROUTE]["PATH"];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTE.LOBBY.PATH,
      name: ROUTE.LOBBY.NAME,
      component: Lobby,
      children: [
        {
          path: ROUTE.WITHDRAW.PATH,
          name: ROUTE.WITHDRAW.NAME,
          component: Withdraw,
        },
        {
          path: ROUTE.DEPOSIT.PATH,
          name: ROUTE.DEPOSIT.NAME,
          component: Deposit,
        },
        {
          path: ROUTE.REQUEST_BETA_TOKENS.PATH,
          name: ROUTE.REQUEST_BETA_TOKENS.NAME,
          component: RequestBetaTokens,
        },
      ],
    },
  ],
});

export default router;
