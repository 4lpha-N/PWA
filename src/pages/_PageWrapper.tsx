import React from "react";
import { Container } from "@mui/material";

interface PageWrapperProps {
  children: React.ReactNode;
  padded?: boolean;
}

export function PageWrapper({ children, padded = true }: PageWrapperProps) {
  return (
    <Container
      maxWidth="xl"
      className={padded ? "custom-scrollbar" : undefined}
      sx={{
        mt: padded ? 2 : 0,
        mb: padded ? 2 : 0,
        // pr: padded ? "0 !important" : undefined,
        // pl: padded ? "0 !important" : undefined,
        ...(padded && {
          height: "calc(100% - 32px)",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarGutter: "stable both-edges",
        }),
      }}
    >
      {children}
    </Container>
  );
}
