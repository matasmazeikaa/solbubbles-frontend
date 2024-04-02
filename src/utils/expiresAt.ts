export const getNewLoginExpiresTimestamp = () => {
  return new Date().setHours(new Date().getHours() + 24);
};

export const isLoginExpired = (expirationTimestamp: number | undefined) => {
  if (expirationTimestamp === undefined) {
    return true;
  }

  return Date.now() > expirationTimestamp;
};
