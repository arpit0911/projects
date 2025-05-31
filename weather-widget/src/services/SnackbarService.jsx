let snackbarFn = () => {
  console.warn("Snackbar function not initialized");
};

export const setSnackbarFunction = (fn) => {
  snackbarFn = fn;
};

export const showSnackbar = (message, severity) => {
  snackbarFn(message, severity);
};
