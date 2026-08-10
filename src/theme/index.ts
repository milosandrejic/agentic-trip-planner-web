import { createTheme } from "@mui/material/styles";

import { palette } from "@/theme/palette";
import { components } from "@/theme/overrides";
import { typography } from "@/theme/typography";
import {
  shape,
  spacingUnit,
} from "@/theme/shape";

export const theme = createTheme({
  components,
  palette,
  shape,
  spacing: spacingUnit,
  typography,
});
