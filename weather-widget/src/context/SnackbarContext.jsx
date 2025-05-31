import { Alert, Snackbar } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { setSnackbarFunction } from "../services/SnackbarService";

// create the Context
const SnackbarContext = createContext();

// create snackbarProvider
export const SnackbarProvider = ({ children }) => {
  // snackbar state to manage the state of the snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", //  success, info, warning, and error
  });
  // function to show the snackbar
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  // function to handle the close event of the snackbar
  const handleClose = () => {
    setSnackbar((prevState) => ({ ...prevState, open: false }));
  };

  useEffect(() => {
    setSnackbarFunction(showSnackbar);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Custom hook to use the Snackbar context
export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
