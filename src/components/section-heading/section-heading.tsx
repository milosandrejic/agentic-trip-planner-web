import {
  Stack,
  Typography,
  type TypographyProps,
} from "@mui/material";

interface SectionHeadingProps {
  align?: "center" | "left";
  description?: string;
  eyebrow: string;
  title: string;
  titleVariant?: TypographyProps["variant"];
}

function SectionDescription({ description }: Pick<SectionHeadingProps, "description">) {
  if (!description) {
    return null;
  }

  return (
    <Typography
      color="text.secondary"
      sx={{ maxWidth: 560 }}
    >
      {description}
    </Typography>
  );
}

export function SectionHeading({
  align = "left",
  description,
  eyebrow,
  title,
  titleVariant = "h2",
}: SectionHeadingProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
      }}
    >
      <Typography
        component="p"
        variant="overline"
        color="secondary"
      >
        {eyebrow}
      </Typography>

      <Typography
        component="h2"
        variant={titleVariant}
      >
        {title}
      </Typography>

      <SectionDescription description={description} />
    </Stack>
  );
}
