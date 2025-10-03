import React from "react";
import { Box, Skeleton, Grid } from "@mui/material";

export const ClassDetailSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="100%" height={48} sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
      </Grid>
    </Box>
  );
};
