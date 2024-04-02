import { api } from "./api";

interface Token {
  token: string;
}

const AUTH_ROUTE = `/auth`;
const AUTH_RANDOM_TOKEN_ROUTE = `${AUTH_ROUTE}/random-token`;

export const getRandomTokenApi = () => api.get<Token>(AUTH_RANDOM_TOKEN_ROUTE);
