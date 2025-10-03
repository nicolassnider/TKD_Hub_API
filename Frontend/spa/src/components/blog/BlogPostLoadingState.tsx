import React from "react";
import { Box, Card, CardContent, Skeleton, Divider } from "@mui/material";

/**
 * Loading state component with skeleton placeholders for blog posts.
 */
export const BlogPostsLoadingState: React.FC = () => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ p: 2 }}>
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="80%" height={20} />
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
