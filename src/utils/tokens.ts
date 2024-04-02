import { PINIA_PERSIST_STORE } from "@/constants";

export const getJWT = () => {
  const jwt = window.localStorage.getItem("JWT");

  return jwt || "";
};

export const setJWT = (jwt: string) => {
  window.localStorage.setItem("JWT", jwt);
};

export const removeJWT = () => {
  window.localStorage.removeItem("JWT");
};

export const cleanAuthData = () => {
  window.localStorage.removeItem("loginInfo");
  window.localStorage.removeItem("account");
};

export const cleanPiniaStores = () => {
  Object.values(PINIA_PERSIST_STORE).forEach((store) => {
    localStorage.removeItem(store);
  });
};
