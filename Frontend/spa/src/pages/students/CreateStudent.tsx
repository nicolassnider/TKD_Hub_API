import React from "react";
import EditStudent from "components/students/EditStudent";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

export default function CreateStudent() {
  const navigate = useNavigate();

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        <EditStudent
          title="Create Student"
          studentId={0}
          onClose={() => navigate("/students")}
        />
      </Box>
    </Box>
  );
}
