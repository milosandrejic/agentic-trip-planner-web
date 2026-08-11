"use client";

import {
  Box,
  ButtonBase,
  Typography,
} from "@mui/material";

import { useAuth } from "@/hooks/use-auth";

export function UserMenu() {
  const { logout, user } = useAuth();

  function handleLogout(): void {
    logout();
  }

  return (
    <Box
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        paddingTop: "12px",
      }}
    >
      {
        user &&
        <Box sx={{ paddingInline: "8px" }}>
          <Typography
            component="p"
            sx={{
              color: "text.primary",
              fontSize: 12.5,
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {user.first_name} {user.last_name}
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "rgba(24, 49, 83, 0.38)",
              fontSize: 11,
              lineHeight: 1.5,
              marginTop: "2px",
            }}
          >
            {user.email}
          </Typography>
        </Box>
      }

      <ButtonBase
        onClick={handleLogout}
        sx={{
          borderRadius: "10px",
          color: "rgba(24, 49, 83, 0.55)",
          fontSize: 12.5,
          fontWeight: 500,
          padding: "9px 11px",
          textAlign: "left",
          width: "100%",
          "&:hover": {
            backgroundColor: "rgba(24, 49, 83, 0.04)",
          },
        }}
      >
        Sign out
      </ButtonBase>
    </Box>
  );
}
