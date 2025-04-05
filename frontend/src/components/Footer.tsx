import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", padding: 2, backgroundColor: "#f8f8f8", marginTop: "auto" }}>
      <Typography variant="body2">&copy; {new Date().getFullYear()} Souled Store. All Rights Reserved.</Typography>
    </Box>
  );
};

export default Footer;
