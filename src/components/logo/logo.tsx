import Image from "next/image";

// prettier-ignore
import {
  Box,
  Typography,
} from "@mui/material";

import logoMark from "@/assets/logo-mark.svg";
import logoSparkle from "@/assets/logo-sparkle.svg";

export type LogoVariant = "marketing" | "workspace";

interface LogoProps {
  showLabel?: boolean;
  variant?: LogoVariant;
}

function MarketingLogoMark() {
  return (
    <Image
      src={logoMark}
      alt=""
      width={22}
      height={22}
      aria-hidden="true"
    />
  );
}

function WorkspaceLogoMark() {
  return (
    <Box
      component="span"
      sx={{
        alignItems: "center",
        background: "linear-gradient(135deg, #183153 0%, #2f9c95 100%)",
        borderRadius: "9px",
        display: "inline-flex",
        height: 30,
        justifyContent: "center",
        width: 30,
      }}
    >
      {/* prettier-ignore */}
      <Image
        src={logoSparkle}
        alt=""
        width={12}
        height={12}
        aria-hidden="true"
      />
    </Box>
  );
}

interface LogoLabelProps {
  isWorkspace: boolean;
  label: string;
  showLabel: boolean;
}

function LogoLabel({ isWorkspace, label, showLabel }: LogoLabelProps) {
  if (!showLabel) {
    return null;
  }

  return (
    <Typography
      component="span"
      variant="h6"
      sx={{
        fontSize: isWorkspace ? "0.875rem" : "0.9375rem",
        lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Typography>
  );
}

export function Logo({ showLabel = true, variant = "marketing" }: LogoProps) {
  const isWorkspace = variant === "workspace";
  const LogoMark = isWorkspace ? WorkspaceLogoMark : MarketingLogoMark;
  const label = isWorkspace ? "Agentic Trip" : "Agentic Trip Planner";

  return (
    <Box
      component="span"
      sx={{
        alignItems: "center",
        display: "inline-flex",
        gap: isWorkspace ? "9px" : "10px",
      }}
    >
      <LogoMark />

      {/* prettier-ignore */}
      <LogoLabel
        isWorkspace={isWorkspace}
        label={label}
        showLabel={showLabel}
      />
    </Box>
  );
}
