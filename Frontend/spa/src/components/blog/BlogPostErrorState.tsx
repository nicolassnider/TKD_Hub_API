import React from "react";
import { Alert, Button } from "@mui/material";

interface BlogPostsErrorStateProps {
  error: string;
  onRetry: () => void;
}

/**
 * Error state component with retry functionality for blog posts.
 */
export const BlogPostsErrorState: React.FC<BlogPostsErrorStateProps> = ({
  error,
  onRetry,
}) => {
  return (
    <Alert
      severity="error"
      sx={{ mb: 3 }}
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      }
    >
      {error}
    </Alert>
  );
};
