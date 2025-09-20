import React from "react";
import EditCoach from "components/EditCoach";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

export default function CreateCoach() {
  const navigate = useNavigate();
  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        <EditCoach
          title="Create Coach"
          coachId={0}
          onClose={() => navigate("/coaches")}
        />
      </Box>
    </Box>
  );
}
