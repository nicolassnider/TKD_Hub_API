// User-related pages
export { default as UserAdministration } from "./UserAdministration";
export { default as UserDetail } from "./UserDetail";
export { default as UsersList } from "./UsersList";

import React, { useState, useEffect } from "react";
import { fetchJson, ApiError } from "lib/api";
import { useRole } from "context/RoleContext";
import ApiTable from "components/common/ApiTable";
import UserEditModal from "components/users/UserEditModal";
import UserCreateModal from "components/users/UserCreateModal";
import { User, CreateUserRequest, UpdateUserRequest } from "../../types/api";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  PersonOff,
  PersonAdd,
} from "@mui/icons-material";

export default function UserAdministration() {
  const { hasRole } = useRole();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUserForMenu, setSelectedUserForMenu] = useState<User | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Redirect if not admin
  if (!hasRole("Admin")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need administrator privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await fetchJson("/api/Users")) as any;

      // Handle the paginated response structure
      if (response?.data?.items) {
        setUsers(response.data.items);
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        setUsers(response);
      } else {
        console.warn("Unexpected API response structure:", response);
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err instanceof ApiError ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await fetchJson(`/api/Users/${userId}`, {
        method: "DELETE",
      });
      await loadUsers(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert(
        "Failed to delete user: " +
          (err instanceof ApiError ? err.message : "Unknown error"),
      );
    }
  };

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    try {
      await fetchJson(`/api/Users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !isActive }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await loadUsers(); // Refresh the list
    } catch (err) {
      console.error("Failed to update user status:", err);
      alert(
        "Failed to update user status: " +
          (err instanceof ApiError ? err.message : "Unknown error"),
      );
    }
  };

  const handleUpdateUser = async (
    userId: number,
    updateData: UpdateUserRequest,
  ) => {
    try {
      await fetchJson(`/api/Users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await loadUsers(); // Refresh the list
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      throw err;
    }
  };

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      await fetchJson("/api/Users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await loadUsers(); // Refresh the list
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create user:", err);
      throw err;
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    user: User,
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUserForMenu(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUserForMenu(null);
  };

  const handleEditFromMenu = () => {
    if (selectedUserForMenu) {
      handleEditUser(selectedUserForMenu);
    }
    handleMenuClose();
  };

  const handleDeleteFromMenu = () => {
    if (selectedUserForMenu) {
      setUserToDelete(selectedUserForMenu);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleToggleActiveFromMenu = () => {
    if (selectedUserForMenu) {
      handleToggleActive(
        selectedUserForMenu.id!,
        !selectedUserForMenu.isActive,
      );
    }
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await handleDeleteUser(userToDelete.id!);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "All" || (user.roles && user.roles.includes(roleFilter));

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          User Administration
        </h1>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAdd />}
          onClick={() => setShowCreateModal(true)}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            px: 3,
            py: 1.5,
          }}
        >
          Add New User
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Users
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <label
              htmlFor="roleFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Role
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Coach">Coach</option>
              <option value="Student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <ApiTable
          rows={filteredUsers}
          columns={[
            { key: "id", label: "ID", sortable: true },
            {
              key: "name",
              label: "Name",
              render: (user: User) => `${user.firstName} ${user.lastName}`,
              sortable: true,
            },
            { key: "email", label: "Email", sortable: true },
            {
              key: "phoneNumber",
              label: "Phone",
              render: (user: User) => user.phoneNumber || "-",
            },
            {
              key: "roles",
              label: "Roles",
              render: (user: User) => (
                <div className="flex flex-wrap gap-1">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role, index) => (
                      <Chip
                        key={index}
                        label={role}
                        size="small"
                        color={
                          role === "Admin"
                            ? "error"
                            : role === "Coach"
                              ? "primary"
                              : "success"
                        }
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <span className="text-gray-500">No roles</span>
                  )}
                </div>
              ),
            },
            {
              key: "dojaang",
              label: "Dojaang",
              render: (user: User) => user.dojaangName || "-",
            },
            {
              key: "status",
              label: "Status",
              render: (user: User) => (
                <Chip
                  label={user.isActive ? "Active" : "Inactive"}
                  size="small"
                  color={user.isActive ? "success" : "default"}
                  variant="filled"
                />
              ),
            },
            {
              key: "actions",
              label: "Actions",
              render: (user: User) => (
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, user)}
                >
                  <MoreVert />
                </IconButton>
              ),
            },
          ]}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditFromMenu}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleToggleActiveFromMenu}>
          {selectedUserForMenu?.isActive ? (
            <PersonOff fontSize="small" sx={{ mr: 1 }} />
          ) : (
            <PersonAdd fontSize="small" sx={{ mr: 1 }} />
          )}
          {selectedUserForMenu?.isActive ? "Deactivate" : "Activate"}
        </MenuItem>
        <MenuItem onClick={handleDeleteFromMenu} sx={{ color: "error.main" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{userToDelete?.firstName}{" "}
            {userToDelete?.lastName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleUpdateUser}
        />
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <UserCreateModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateUser}
        />
      )}
    </div>
  );
}
