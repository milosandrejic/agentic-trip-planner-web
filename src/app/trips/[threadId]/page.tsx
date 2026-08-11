import { Box } from "@mui/material";

import { WorkspaceLayout } from "@/layouts/workspace-layout/workspace-layout";

import { RequireAuth } from "@/components/auth/require-auth";
import { WorkspaceSidebar } from "@/components/workspace/sidebar/workspace-sidebar";

export default function TripsPage() {
  return (
    <RequireAuth>
      <WorkspaceLayout
        overview={<Box />}
        sidebar={<WorkspaceSidebar />}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            justifyContent: "center",
            minHeight: "100dvh",
            padding: 4,
          }}
        >
          <Box
            component="p"
            sx={{
              color: "text.disabled",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Select a thread to load.
          </Box>
        </Box>
      </WorkspaceLayout>
    </RequireAuth>
  );
}
