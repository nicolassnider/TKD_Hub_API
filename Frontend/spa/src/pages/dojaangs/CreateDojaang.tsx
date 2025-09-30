import React from "react";
import EditDojaang from "components/dojaangs/EditDojaang";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";

export default function CreateDojaang() {
  const navigate = useNavigate();
  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        <EditDojaang
          title="Create Dojaang"
          dojaangId={0}
          onClose={() => navigate("/dojaangs")}
        />
      </Box>
    </Box>
  );
}
