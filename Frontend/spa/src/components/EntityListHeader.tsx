import {
  Box,
  Button,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import { Add } from "@mui/icons-material";

interface EntityListHeaderProps {
  title: string;
  onAdd?: () => void;
  addButtonText?: string;
  showInactiveFilter?: boolean;
  showInactive?: boolean;
  onShowInactiveChange?: (value: boolean) => void;
  totalCount?: number;
  activeCount?: number;
}

export function EntityListHeader({
  title,
  onAdd,
  addButtonText = `Add ${title.slice(0, -1)}`, // Remove 's' from title
  showInactiveFilter = false,
  showInactive = false,
  onShowInactiveChange,
  totalCount,
  activeCount,
}: EntityListHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {(totalCount !== undefined || activeCount !== undefined) && (
          <Typography variant="body2" color="text.secondary">
            {activeCount !== undefined && `${activeCount} active`}
            {activeCount !== undefined && totalCount !== undefined && ` • `}
            {totalCount !== undefined && `${totalCount} total`}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {showInactiveFilter && (
          <FormControlLabel
            control={
              <Switch
                checked={showInactive}
                onChange={(e) => onShowInactiveChange?.(e.target.checked)}
                size="small"
              />
            }
            label="Show inactive"
            sx={{ m: 0 }}
          />
        )}

        {onAdd && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAdd}
            sx={{
              minWidth: "fit-content",
              whiteSpace: "nowrap",
            }}
          >
            {addButtonText}
          </Button>
        )}
      </Box>
    </Box>
  );
}
