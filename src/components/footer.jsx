import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#7289da",
        color: "black",
        py: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Nakis's. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link href="/privacy" color="inherit">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="/terms" color="inherit">
            Terms of Service
          </Link>{" "}
          |{" "}
          <Link href="/contact" color="inherit">
            Contact Us
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
