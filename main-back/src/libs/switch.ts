export const safeGuard = (arg: never, errorMessage?: string) => {
  throw new Error(
    errorMessage || `Not all cases been captured in switch ${arg}`
  );
};

export const Switch = {
  safeGuard,
};
