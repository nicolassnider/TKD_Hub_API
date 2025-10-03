import React from "react";
import { Menu, MenuItem } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";

interface ClassActionMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onManageStudents: () => void;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canManageStudents: boolean;
  };
}

export const ClassActionMenu: React.FC<ClassActionMenuProps> = ({
  anchorEl,
  onClose,
  onEdit,
  onDelete,
  onManageStudents,
  permissions,
}) => {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      {permissions.canManageStudents && (
        <MenuItem onClick={onManageStudents}>
          <GroupsIcon sx={{ mr: 1 }} />
          Manage Students
        </MenuItem>
      )}
      {permissions.canEdit && (
        <MenuItem onClick={onEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Class
        </MenuItem>
      )}
      {permissions.canDelete && (
        <MenuItem onClick={onDelete}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Class
        </MenuItem>
      )}
    </Menu>
  );
};
