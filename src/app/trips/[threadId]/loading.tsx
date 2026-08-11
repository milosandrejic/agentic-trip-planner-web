import {
  Box,
  CircularProgress,
} from "@mui/material";

export default function ThreadLoading() {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
        width: "100%",
      }}
    >
      <CircularProgress
        size={32}
        sx={{ color: "text.disabled" }}
      />
    </Box>
  );
}
