import Image from "next/image";

import {
  Box,
  Typography,
} from "@mui/material";

import logoMark from "@/assets/logo-mark.svg";
import authSparkle from "@/assets/auth-sparkle.svg";
import logoSparkle from "@/assets/logo-sparkle.svg";

export type LogoVariant = "auth" | "marketing" | "workspace";

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

function AuthLogoMark() {
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
      <Image
        src={authSparkle}
        alt=""
        width={15}
        height={15}
        aria-hidden="true"
      />
    </Box>
  );
}

interface LogoLabelProps {
  variant: LogoVariant;
  label: string;
  showLabel: boolean;
}

function getLogoLabelFontSize(variant: LogoVariant): string {
  if (variant === "auth") {
    return "0.90625rem";
  }

  if (variant === "workspace") {
    return "0.875rem";
  }

  return "0.9375rem";
}

function LogoLabel({ variant, label, showLabel }: LogoLabelProps) {
  if (!showLabel) {
    return null;
  }

  return (
    <Typography
      component="span"
      variant="h6"
      sx={{
        fontSize: getLogoLabelFontSize(variant),
        lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Typography>
  );
}

interface LogoMarkProps {
  variant: LogoVariant;
}

function LogoMark({ variant }: LogoMarkProps) {
  if (variant === "auth") {
    return <AuthLogoMark />;
  }

  if (variant === "workspace") {
    return <WorkspaceLogoMark />;
  }

  return <MarketingLogoMark />;
}

function getLogoGap(variant: LogoVariant): string {
  if (variant === "auth") {
    return "8px";
  }

  if (variant === "workspace") {
    return "9px";
  }

  return "10px";
}

export function Logo({ showLabel = true, variant = "marketing" }: LogoProps) {
  const isWorkspace = variant === "workspace";
  const label = isWorkspace ? "Agentic Trip" : "Agentic Trip Planner";

  return (
    <Box
      component="span"
      sx={{
        alignItems: "center",
        display: "inline-flex",
        gap: getLogoGap(variant),
      }}
    >
      <LogoMark variant={variant} />

      <LogoLabel
        variant={variant}
        label={label}
        showLabel={showLabel}
      />
    </Box>
  );
}
