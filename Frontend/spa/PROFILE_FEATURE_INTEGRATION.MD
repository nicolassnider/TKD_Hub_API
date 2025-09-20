# Profile Feature Integration Guide

## Overview

This guide explains how to integrate the comprehensive profile feature into your TKD Hub SPA application, including role-based dashboards and MercadoPago payment integration.

## Components Created

### 1. Type Definitions

- **`types/profile.ts`** - Complete TypeScript interfaces for user profiles, payments, and enrollments

### 2. Context Provider

- **`context/ProfileContext.tsx`** - State management for profile data, payments, and class enrollments

### 3. Main Components

- **`pages/ProfilePage.tsx`** - Main profile page with role-based tabs
- **`components/CoachClassesSection.tsx`** - Coach dashboard for managing classes
- **`components/StudentClassSection.tsx`** - Student dashboard for viewing enrolled class
- **`components/PaymentSection.tsx`** - Payment management with MercadoPago integration
- **`components/PaymentHistory.tsx`** - Payment history with filtering and receipts

## Features Implemented

### 🎯 Role-Based Profile Views

#### **Coach Profile Features:**

- ✅ View and manage all assigned classes
- ✅ See total students across all classes
- ✅ Quick access to upcoming classes
- ✅ Mark student attendance
- ✅ Navigate to detailed class management
- ✅ Statistics dashboard (classes managed, total students)

#### **Student Profile Features:**

- ✅ View enrolled class details and schedule
- ✅ See next class information
- ✅ Check payment status and upcoming dues
- ✅ View classmates and instructor information
- ✅ Attendance rate tracking
- ✅ Quick actions for payments and schedules

#### **Combined Roles (Coach + Student):**

- ✅ Tabbed interface showing both coach and student views
- ✅ Separate sections for managed classes and enrolled class
- ✅ Payment management for student role

### 💳 MercadoPago Payment Integration

- ✅ Create new payments with amount and description
- ✅ View upcoming and overdue payments
- ✅ Payment status tracking (Paid, Pending, Overdue)
- ✅ Payment history with filtering and search
- ✅ Secure redirect to MercadoPago checkout
- ✅ Transaction ID tracking
- ✅ Multi-currency support (ARS, USD)

### 📊 Dashboard Analytics

- ✅ Quick stats cards for each role
- ✅ Attendance rate calculation
- ✅ Payment status overview
- ✅ Upcoming classes and payments
- ✅ Visual progress indicators

## Integration Steps

### Step 1: Update App.tsx Router

Add the profile route to your main routing configuration:

```tsx
// In your App.tsx or main router file
import { ProfilePage } from "./pages/ProfilePage";

// Add this route:
<Route path="/profile" element={<ProfilePage />} />;
```

### Step 2: Update Context Providers

Wrap your app with the ProfileContext provider:

```tsx
// In your main App.tsx
import { ProfileProvider } from "./context/ProfileContext";

function App() {
  return (
    <RoleProvider>
      <ProfileProvider>{/* Your existing app content */}</ProfileProvider>
    </RoleProvider>
  );
}
```

### Step 3: Add Navigation Menu Item

Add a navigation item for profile in your main menu:

```tsx
// In your navigation component
import { Person as PersonIcon } from '@mui/icons-material';

// Add this menu item:
{
  text: 'Profile',
  icon: <PersonIcon />,
  path: '/profile',
  roles: ['Admin', 'Coach', 'Student'] // All authenticated users
}
```

### Step 4: Required API Endpoints

#### Profile Management

- `GET /api/profile` - Get user profile with role-specific data
- `PUT /api/profile` - Update user profile information
- `GET /api/profile/managed-classes` - Get classes managed by coach
- `GET /api/profile/enrolled-class` - Get class enrolled by student

#### Payment Management

- `GET /api/profile/payments` - Get payment history for student
- `POST /api/payments/create` - Create new MercadoPago payment
- `GET /api/payments/{id}` - Get payment details
- `POST /api/payments/webhook` - MercadoPago webhook for payment updates

#### Attendance Tracking

- `POST /api/attendance` - Mark student attendance (coaches only)
- `GET /api/attendance/class/{classId}` - Get attendance records for class
- `GET /api/attendance/student/{studentId}` - Get student's attendance history

#### Class Enrollments

- `GET /api/trainingclasses/{id}/students` - Get enrolled students
- `POST /api/trainingclasses/{id}/students/{studentId}` - Enroll student
- `DELETE /api/trainingclasses/{id}/students/{studentId}` - Remove student

### Step 5: MercadoPago Configuration

#### Backend Configuration (Required)

```json
{
  "MercadoPago": {
    "AccessToken": "YOUR_ACCESS_TOKEN",
    "PublicKey": "YOUR_PUBLIC_KEY",
    "WebhookSecret": "YOUR_WEBHOOK_SECRET",
    "SuccessUrl": "https://yourdomain.com/profile?payment=success",
    "FailureUrl": "https://yourdomain.com/profile?payment=failure",
    "PendingUrl": "https://yourdomain.com/profile?payment=pending"
  }
}
```

#### API Response Format

```typescript
// Create payment response
{
  "id": "mp-payment-id",
  "title": "Monthly Class Fee",
  "description": "Payment for TKD training class",
  "amount": 5000.00,
  "currency": "ARS",
  "preferenceId": "preference-id",
  "paymentUrl": "https://mercadopago.com/checkout/...",
  "status": "pending",
  "studentId": 123,
  "classId": 456,
  "dueDate": "2025-01-15"
}
```

## Usage Examples

### Role-Based Access

The profile page automatically adapts based on user roles:

- **Admin**: Full access to all features
- **Coach**: Can manage classes and mark attendance
- **Student**: Can view enrolled class and make payments
- **Coach + Student**: Sees both coach and student tabs

### Payment Flow

1. Student navigates to Profile → Payments tab
2. Views upcoming/overdue payments
3. Clicks "Pay Now" on a payment
4. Fills payment form (amount, description, due date)
5. Redirected to MercadoPago for secure payment
6. Returns to profile with updated payment status

### Coach Class Management

1. Coach navigates to Profile → My Classes tab
2. Views all managed classes with statistics
3. Can mark attendance for recent classes
4. Quick access to detailed class management
5. View upcoming classes and student counts

## Testing Checklist

### Profile Features

- [ ] Profile loads correctly for each role type
- [ ] Role-based tabs display appropriate content
- [ ] Profile information updates successfully
- [ ] Quick stats display accurate data
- [ ] Navigation links work correctly

### Coach Features

- [ ] Can view all managed classes
- [ ] Attendance marking works properly
- [ ] Student counts are accurate
- [ ] Class navigation functions correctly
- [ ] Upcoming classes display properly

### Student Features

- [ ] Enrolled class information displays correctly
- [ ] Payment status is accurate
- [ ] Next class information is correct
- [ ] Classmates list displays properly
- [ ] Attendance rate calculates correctly

### Payment Features

- [ ] Can create new payments
- [ ] MercadoPago integration works
- [ ] Payment history displays correctly
- [ ] Status updates properly
- [ ] Filtering and search function
- [ ] Currency formatting is correct

## Database Schema Updates

Ensure your database has these tables/relationships:

```sql
-- User profile extensions
ALTER TABLE Users ADD COLUMN ProfilePictureUrl NVARCHAR(500);
ALTER TABLE Users ADD COLUMN Bio NTEXT;
ALTER TABLE Users ADD COLUMN PhoneNumber NVARCHAR(20);
ALTER TABLE Users ADD COLUMN EmergencyContact NVARCHAR(100);
ALTER TABLE Users ADD COLUMN EmergencyPhone NVARCHAR(20);
ALTER TABLE Users ADD COLUMN MembershipStartDate DATETIME;
ALTER TABLE Users ADD COLUMN MembershipStatus NVARCHAR(20) DEFAULT 'Active';

-- Payment tracking
CREATE TABLE Payments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT FOREIGN KEY REFERENCES Users(Id),
    Amount DECIMAL(10,2) NOT NULL,
    Currency NVARCHAR(3) DEFAULT 'ARS',
    PaymentDate DATETIME NOT NULL,
    DueDate DATETIME NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    PaymentMethod NVARCHAR(50) NOT NULL,
    TransactionId NVARCHAR(100),
    Description NVARCHAR(500) NOT NULL,
    ClassId INT FOREIGN KEY REFERENCES TrainingClasses(Id),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Attendance tracking
CREATE TABLE AttendanceRecords (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT FOREIGN KEY REFERENCES Users(Id),
    ClassId INT FOREIGN KEY REFERENCES TrainingClasses(Id),
    Date DATE NOT NULL,
    Present BIT NOT NULL,
    Notes NVARCHAR(500),
    MarkedBy INT FOREIGN KEY REFERENCES Users(Id),
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

## Security Considerations

### Payment Security

- ✅ All payment processing handled by MercadoPago
- ✅ No sensitive payment data stored locally
- ✅ Webhook validation for payment updates
- ✅ Transaction ID verification

### Role-Based Access

- ✅ API endpoints validate user permissions
- ✅ Coaches can only access their assigned classes
- ✅ Students can only access their own data
- ✅ Admin role has full access oversight

### Data Protection

- ✅ Profile data protected by authentication
- ✅ Payment history encrypted in transit
- ✅ Attendance records audit trail
- ✅ Personal information access logging

## Future Enhancements

1. **Progress Tracking**: Belt progression and skill development
2. **Notifications**: Email/SMS for payment reminders and class updates
3. **Calendar Integration**: Sync class schedules with external calendars
4. **Mobile App**: React Native version for mobile access
5. **Bulk Payments**: Family plans and multi-month payments
6. **Communication**: Direct messaging between coaches and students

The profile feature provides a comprehensive dashboard tailored to each user's role, with secure payment integration and efficient class management tools. It enhances the user experience while maintaining security and data integrity.
