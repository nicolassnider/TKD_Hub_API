# Class Management System Integration Guide

## Overview

This guide explains how to integrate the new class management system into your TKD Hub SPA application.

## Components Created

### 1. Type Definitions

- **`types/classes.ts`** - Complete TypeScript interfaces for class management

### 2. Context Provider

- **`context/ClassContext.tsx`** - State management for classes, schedules, and student assignments

### 3. UI Components

- **`components/EnhancedClassForm.tsx`** - Create/edit classes with schedule management
- **`components/ClassList.tsx`** - Card-based class listing
- **`components/ClassDetail.tsx`** - Detailed class view with student management
- **`components/StudentAssignment.tsx`** - Student enrollment management dialog
- **`pages/ClassPage.tsx`** - Main page with tabs for different views

## Integration Steps

### Step 1: Update App.tsx Router

Add the class routes to your main routing configuration:

```tsx
// In your App.tsx or main router file
import { ClassPage } from './pages/ClassPage';
import { ClassDetail } from './components/ClassDetail';

// Add these routes:
<Route path="/classes" element={<ClassPage />} />
<Route path="/classes/:id" element={<ClassDetail />} />
```

### Step 2: Update Context Providers

Wrap your app with the ClassContext provider:

```tsx
// In your main App.tsx
import { ClassProvider } from "./context/ClassContext";

function App() {
  return (
    <RoleProvider>
      <ClassProvider>{/* Your existing app content */}</ClassProvider>
    </RoleProvider>
  );
}
```

### Step 3: Add Navigation Menu Item

Add a navigation item for classes in your main menu:

```tsx
// In your navigation component
import { Class as ClassIcon } from '@mui/icons-material';

// Add this menu item:
{
  text: 'Classes',
  icon: <ClassIcon />,
  path: '/classes',
  roles: ['Admin', 'Coach', 'Student'] // Adjust based on your requirements
}
```

### Step 4: API Endpoints Required

Ensure your backend API has these endpoints:

#### Training Classes

- `GET /api/trainingclasses` - List all classes
- `GET /api/trainingclasses/{id}` - Get specific class
- `POST /api/trainingclasses` - Create new class
- `PUT /api/trainingclasses/{id}` - Update class
- `DELETE /api/trainingclasses/{id}` - Delete class

#### Class Schedules

- `GET /api/trainingclasses/{id}/schedules` - Get class schedules
- `POST /api/trainingclasses/{id}/schedules` - Add schedule
- `PUT /api/classschedules/{id}` - Update schedule
- `DELETE /api/classschedules/{id}` - Delete schedule

#### Student Assignments

- `GET /api/trainingclasses/{id}/students` - Get enrolled students
- `POST /api/trainingclasses/{id}/students/{studentId}` - Assign student
- `DELETE /api/trainingclasses/{id}/students/{studentId}` - Remove student
- `GET /api/students/available/{classId}` - Get available students for assignment

#### Supporting Data

- `GET /api/coaches` - List coaches for form selection
- `GET /api/dojaangs` - List dojaangs for form selection

### Step 5: Verify Dependencies

Make sure these components exist in your project:

- `EntityListHeader` component
- `EntityActions` component
- `DeleteConfirmationDialog` component
- `FormFields` component
- `useFormData` hook
- `RoleContext` with role-based permissions

## Features Included

### 🎯 Core Functionality

- ✅ Create, edit, delete training classes
- ✅ Schedule management with day/time selection
- ✅ Schedule conflict detection
- ✅ Coach assignment
- ✅ Dojaang (location) assignment
- ✅ Student enrollment management
- ✅ Role-based permissions (Admin/Coach/Student)

### 📱 User Interface

- ✅ Responsive card-based class listing
- ✅ Detailed class view with schedule and student info
- ✅ Dual-pane student assignment interface
- ✅ Tabbed page layout (List/Schedule views)
- ✅ Form validation and error handling
- ✅ Loading states and skeletons
- ✅ Material-UI consistent design

### 🔒 Permission System

- **Admin**: Full access to all features
- **Coach**: Can manage own classes and students
- **Student**: Can view classes and schedules (read-only)
- **Guest**: No access to class management

### 📊 Data Management

- ✅ Centralized state management with Context API
- ✅ Type-safe API interactions
- ✅ Optimistic updates for better UX
- ✅ Error handling and validation
- ✅ Schedule conflict prevention

## Usage Examples

### Basic Class Creation

1. Navigate to `/classes`
2. Click "New Class" button (Admin/Coach only)
3. Fill in class details, schedules, and assignments
4. System validates for scheduling conflicts
5. Save to create the class

### Student Assignment

1. Open class detail view
2. Click "Manage Students" button
3. Use the dual-pane interface to assign/remove students
4. Search functionality helps find specific students
5. Changes are saved automatically

### Schedule Management

Classes can have multiple schedules (e.g., Monday and Friday at 7 PM):

- Each schedule has day of week, start time, and end time
- System prevents overlapping schedules for the same coach/location
- Visual chips display schedule information clearly

## Next Steps

1. **Calendar Integration**: The schedule view tab is prepared for a future calendar component
2. **Attendance Tracking**: Could be added to track student attendance per class session
3. **Class Categories**: Could add belt levels or class types (Adult, Kids, etc.)
4. **Waitlist Management**: Could add waitlist functionality for full classes
5. **Notifications**: Could notify students of schedule changes

## Testing Checklist

- [ ] Can create new classes with schedules
- [ ] Schedule conflict detection works
- [ ] Can assign/remove students from classes
- [ ] Permission system works correctly
- [ ] All CRUD operations function properly
- [ ] UI is responsive on mobile devices
- [ ] Error handling displays appropriately
- [ ] Navigation and routing work correctly

## Support

The class management system follows the same patterns as your existing entity management (students, coaches, etc.), making it consistent with your application's architecture. All components use Material-UI for consistent styling and include proper TypeScript types for development safety.
