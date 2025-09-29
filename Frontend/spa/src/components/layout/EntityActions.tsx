import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Restore,
  Add,
} from "@mui/icons-material";
import { useState } from "react";

export interface EntityAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  divider?: boolean;
  color?: "inherit" | "primary" | "secondary" | "error" | "warning";
  disabled?: boolean;
}

interface EntityActionsProps {
  actions: EntityAction[];
  disabled?: boolean;
}

export function EntityActions({
  actions,
  disabled = false,
}: EntityActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: EntityAction) => {
    action.onClick();
    handleClose();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        disabled={disabled}
        aria-label="Entity actions"
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {actions.map((action, index) => [
          <MenuItem
            key={index}
            onClick={() => handleActionClick(action)}
            disabled={action.disabled}
            sx={{ color: action.color }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{action.icon}</ListItemIcon>
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>,
          action.divider && (
            <Divider key={`divider-${index}`} apiPath={""} id={undefined} />
          ),
        ])}
      </Menu>
    </>
  );
}

// Common action creators for consistency
export const createViewAction = (onClick: () => void): EntityAction => ({
  icon: <Visibility />,
  label: "View Details",
  onClick,
});

export const createEditAction = (onClick: () => void): EntityAction => ({
  icon: <Edit />,
  label: "Edit",
  onClick,
});

export const createDeleteAction = (onClick: () => void): EntityAction => ({
  icon: <Delete />,
  label: "Delete",
  onClick,
  color: "error",
  divider: true,
});

export const createRestoreAction = (onClick: () => void): EntityAction => ({
  icon: <Restore />,
  label: "Restore",
  onClick,
  color: "primary",
});

export const createAddRelatedAction = (
  label: string,
  onClick: () => void,
): EntityAction => ({
  icon: <Add />,
  label,
  onClick,
  color: "primary",
});

// For Student-specific actions
export const createStudentActions = (
  student: any,
  onViewDetails: () => void,
  onViewPromotions: () => void,
  onAddPromotion: () => void,
  onDelete: () => void,
): EntityAction[] => [
  createViewAction(onViewDetails),
  createAddRelatedAction("View Promotions", onViewPromotions),
  createAddRelatedAction("Add Promotion", onAddPromotion),
  createDeleteAction(onDelete),
];

// For Coach-specific actions
export const createCoachActions = (
  coach: any,
  onViewDetails: () => void,
  onEdit: () => void,
  onDelete: () => void,
): EntityAction[] => [
  createViewAction(onViewDetails),
  createEditAction(onEdit),
  createDeleteAction(onDelete),
];

// For Dojaang-specific actions
export const createDojaangActions = (
  dojaang: any,
  onViewDetails: () => void,
  onEdit: () => void,
  onDelete: () => void,
): EntityAction[] => [
  createViewAction(onViewDetails),
  createEditAction(onEdit),
  createDeleteAction(onDelete),
];

// For Event-specific actions
export const createEventActions = (
  event: any,
  onViewDetails: () => void,
  onEdit: () => void,
  onDelete: () => void,
): EntityAction[] => [
  createViewAction(onViewDetails),
  createEditAction(onEdit),
  createDeleteAction(onDelete),
];
