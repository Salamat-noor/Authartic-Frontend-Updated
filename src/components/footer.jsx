// components/Footer.js
import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      className="w-full flex justify-center items-center h-24 bg-[#22477F]"
      component="footer"
    >
      <Box className="flex justify-center gap-20   text-white w-full">
        <Link href="/about">
          <Typography
            variant="body1"
            className="hover:underline font-kodchasan responsive-h1"
          >
            About
          </Typography>
        </Link>
        <Link href="/terms">
          <Typography
            variant="body1"
            className="hover:underline font-kodchasan responsive-h1"
          >
            Terms
          </Typography>
        </Link>
        <Link href="/contactUs">
          <Typography
            variant="body1"
            className="hover:underline font-kodchasan responsive-h1"
          >
            Contact
          </Typography>
        </Link>
        <Link href="/FAQ">
          <Typography
            variant="body1"
            className="hover:underline font-kodchasan responsive-h1"
          >
            Help
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
