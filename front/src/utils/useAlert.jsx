import { useState } from "react";
import { Alert, Box, Collapse, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export const useAlert = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [alertOpen, setAlertOpen] = useState(false);

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  const AlertComponent = () => (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Collapse in={alertOpen}>
        <Alert
          severity={alertSeverity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={closeAlert}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          {alertMessage}
        </Alert>
      </Collapse>
    </Box>
  );

  return { showAlert, AlertComponent };
};
