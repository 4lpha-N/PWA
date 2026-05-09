import type { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import {
  MaterialDesignContent,
  SnackbarProvider as NotistackSnackbarProvider,
  type SnackbarProviderProps,
} from "notistack";

const DefaultSnackbarContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-default": {
    backgroundColor: "var(--background-1)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
  },
}));

type SnackbarProviderPropsWithChildren = {
  children: ReactNode;
} & Partial<SnackbarProviderProps>;

export default function SnackbarProvider({
  children,
  maxSnack = 3,
  autoHideDuration = 3000,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
  dense = false,
  Components,
  ...props
}: SnackbarProviderPropsWithChildren) {
  return (
    <NotistackSnackbarProvider
      maxSnack={maxSnack}
      autoHideDuration={autoHideDuration}
      anchorOrigin={anchorOrigin}
      dense={dense}
      Components={{
        ...Components,
        default: DefaultSnackbarContent,
      }}
      {...props}
    >
      {children}
    </NotistackSnackbarProvider>
  );
}
