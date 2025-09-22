# User Administration Feature

## Overview

The User Administration feature provides a comprehensive interface for Admin users to manage all users in the TKD Hub system. This feature is only accessible to users with Admin role privileges.

## Features

### 🔍 User Management Dashboard

- **Complete User List**: View all users in the system with key information
- **Search & Filter**: Search by name/email and filter by role (Admin, Coach, Student)
- **Role-based Access**: Only visible and accessible to Admin users

### 👤 User Information Display

- **User Details**: Name, email, phone number, dojaang affiliation
- **Role Management**: View and edit user roles with color-coded badges
- **Status Management**: Active/Inactive status with quick toggle
- **Belt Progression**: Current rank and belt level information

### ✏️ User Editing

- **Profile Updates**: Edit user personal information
- **Role Assignment**: Add/remove Admin, Coach, and Student roles
- **Dojaang Assignment**: Assign users to specific dojaangs
- **Rank Management**: Set current belt rank
- **Status Control**: Activate/deactivate user accounts

### ➕ User Creation

- **New User Registration**: Create new users with full profile information
- **Password Setup**: Secure password creation (minimum 6 characters)
- **Role Assignment**: Assign initial roles during creation
- **Initial Configuration**: Set starting rank and dojaang affiliation

### 🔒 Security Features

- **Admin-Only Access**: Protected by role-based authentication
- **Safe Operations**: Confirmation dialogs for destructive actions
- **Admin Protection**: Prevents deletion of Admin users
- **Validation**: Form validation for all user data

## Access Control

### Navigation

- **Menu Item**: "User Administration" appears only for Admin users
- **Route Protection**: `/users` route requires Admin role
- **Graceful Fallback**: Non-admin users see "Access Denied" message

### Role Hierarchy

- **Admin**: Full access to all user management features
- **Coach**: No access to user administration
- **Student**: No access to user administration

## Technical Implementation

### Components Structure

```
pages/UserAdministration.tsx     - Main admin panel
components/admin/
├── UserTable.tsx               - User list with actions
├── UserEditModal.tsx           - Edit existing users
└── UserCreateModal.tsx         - Create new users
types/user.ts                   - User-related TypeScript interfaces
```

### API Integration

- **GET /api/users**: Fetch all users
- **POST /api/users**: Create new user
- **PUT /api/users/{id}**: Update user details
- **PATCH /api/users/{id}**: Update user status
- **DELETE /api/users/{id}**: Delete user (with restrictions)

### Data Management

- **Real-time Updates**: List refreshes after all operations
- **Error Handling**: Comprehensive error messages for all operations
- **Loading States**: Visual feedback during API operations
- **Optimistic Updates**: Immediate UI feedback

## User Experience

### Dashboard Layout

- **Header Section**: Title and "Add New User" button
- **Search Controls**: Search bar and role filter dropdown
- **User Table**: Sortable columns with action buttons
- **Modal Dialogs**: Edit and create forms in overlay modals

### Visual Design

- **Role Badges**: Color-coded role indicators (Admin=Red, Coach=Blue, Student=Green)
- **Status Indicators**: Green for active, red for inactive users
- **Responsive Layout**: Works on desktop and mobile devices
- **Intuitive Icons**: Clear visual indicators for all actions

### Accessibility

- **Keyboard Navigation**: Full keyboard support for all controls
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **High Contrast**: Clear visual distinctions for all elements
- **Error Messaging**: Clear feedback for all validation errors

## Data Integration

### Sample Data Support

- **Argentine Data**: Works seamlessly with the Argentine sample data
- **Realistic Testing**: Use sample coaches and students for testing
- **Multiple Dojaangs**: Supports users across different dojaang locations
- **Rank Progression**: Integrates with belt ranking system

### Related Systems

- **Profile Management**: Links to individual user profiles
- **Class Management**: Shows user class enrollments and teaching assignments
- **Dojaang Management**: Connects to dojaang administration
- **Role System**: Integrates with authentication and authorization

## Security Considerations

### Data Protection

- **Password Security**: Passwords are securely hashed
- **Role Validation**: Server-side role verification
- **Audit Trail**: All changes are logged for security purposes
- **Session Management**: Proper authentication token handling

### Access Control

- **Route Guards**: Multiple layers of access protection
- **Role Verification**: Both client and server-side role checks
- **Permission Granularity**: Fine-grained access control
- **Admin Safeguards**: Special protection for admin accounts

This User Administration feature provides a complete solution for managing users in the TKD Hub system, ensuring that administrators have all the tools they need while maintaining security and usability standards.
