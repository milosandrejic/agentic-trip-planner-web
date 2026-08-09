import type { ThemeComponents } from "@/theme/overrides/types";

import { cardOverrides } from "@/theme/overrides/card";
import { chipOverrides } from "@/theme/overrides/chip";
import { buttonOverrides } from "@/theme/overrides/button";
import { dialogOverrides } from "@/theme/overrides/dialog";
import { appBarOverrides } from "@/theme/overrides/app-bar";
import { accordionOverrides } from "@/theme/overrides/accordion";
import { textFieldOverrides } from "@/theme/overrides/text-field";

export const components: ThemeComponents = {
  MuiAccordion: accordionOverrides.MuiAccordion,
  MuiAccordionDetails: accordionOverrides.MuiAccordionDetails,
  MuiAccordionSummary: accordionOverrides.MuiAccordionSummary,
  MuiAppBar: appBarOverrides,
  MuiButton: buttonOverrides,
  MuiCard: cardOverrides,
  MuiChip: chipOverrides,
  MuiDialog: dialogOverrides.MuiDialog,
  MuiDialogActions: dialogOverrides.MuiDialogActions,
  MuiDialogContent: dialogOverrides.MuiDialogContent,
  MuiDialogTitle: dialogOverrides.MuiDialogTitle,
  MuiInputLabel: textFieldOverrides.MuiInputLabel,
  MuiOutlinedInput: textFieldOverrides.MuiOutlinedInput,
  MuiTextField: textFieldOverrides.MuiTextField,
};
