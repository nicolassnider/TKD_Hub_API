-- Dashboard Sample Data for TKD Hub
-- This file creates sample dashboard layouts and widgets for different user roles

USE [TKDHubDb]
GO

-- ===============================================
-- Dashboard Layouts for Different User Roles
-- ===============================================

-- Admin Dashboard Layout
INSERT INTO [dbo].[DashboardLayouts] ([Id], [UserId], [Name], [IsDefault], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    1, -- Assuming admin user has ID 1
    'Admin Overview Dashboard',
    1,
    GETDATE(),
    GETDATE(),
    N'{
        "title": "Admin Overview",
        "description": "Complete system overview for administrators",
        "theme": "admin",
        "refreshInterval": 30000,
        "layout": {
            "columns": 12,
            "rowHeight": 100,
            "margin": [10, 10]
        }
    }'
);

-- Coach Dashboard Layout
INSERT INTO [dbo].[DashboardLayouts] ([Id], [UserId], [Name], [IsDefault], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    2, -- Assuming first coach user has ID 2
    'Coach Management Dashboard',
    1,
    GETDATE(),
    GETDATE(),
    N'{
        "title": "Coach Dashboard",
        "description": "Student and class management for coaches",
        "theme": "coach",
        "refreshInterval": 60000,
        "layout": {
            "columns": 12,
            "rowHeight": 100,
            "margin": [10, 10]
        }
    }'
);

-- Student Dashboard Layout
INSERT INTO [dbo].[DashboardLayouts] ([Id], [UserId], [Name], [IsDefault], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    3, -- Assuming first student user has ID 3
    'Student Progress Dashboard',
    1,
    GETDATE(),
    GETDATE(),
    N'{
        "title": "My Progress",
        "description": "Track your Taekwondo journey and achievements",
        "theme": "student",
        "refreshInterval": 120000,
        "layout": {
            "columns": 12,
            "rowHeight": 100,
            "margin": [10, 10]
        }
    }'
);

GO

-- ===============================================
-- Sample Widgets for Admin Dashboard
-- ===============================================

DECLARE @AdminLayoutId UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM DashboardLayouts WHERE Name = 'Admin Overview Dashboard');

-- Total Students Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @AdminLayoutId,
    'Total Students',
    'metric',
    0, 0, 3, 2,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "students",
        "metric": "total",
        "icon": "users",
        "color": "#3b82f6",
        "format": "number"
    }'
);

-- Active Classes Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @AdminLayoutId,
    'Active Classes',
    'metric',
    3, 0, 3, 2,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "classes",
        "metric": "active",
        "icon": "calendar",
        "color": "#10b981",
        "format": "number"
    }'
);

-- Monthly Revenue Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @AdminLayoutId,
    'Monthly Revenue',
    'metric',
    6, 0, 3, 2,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "payments",
        "metric": "monthly_total",
        "icon": "currency-dollar",
        "color": "#f59e0b",
        "format": "currency",
        "currency": "ARS"
    }'
);

-- System Health Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @AdminLayoutId,
    'System Health',
    'status',
    9, 0, 3, 2,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "system",
        "metric": "health",
        "icon": "heart",
        "showUptime": true,
        "showMemory": true
    }'
);

-- Student Enrollment Trends Chart
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @AdminLayoutId,
    'Student Enrollment Trends',
    'line-chart',
    0, 2, 6, 4,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "students",
        "metric": "enrollment_trends",
        "timeRange": "6months",
        "xAxis": "month",
        "yAxis": "student_count",
        "colors": ["#3b82f6", "#10b981"]
    }'
);

-- Belt Distribution Chart
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @AdminLayoutId,
    'Belt Distribution',
    'pie-chart',
    6, 2, 6, 4,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "students",
        "metric": "belt_distribution",
        "showLegend": true,
        "showPercentages": true,
        "colors": ["#ffffff", "#ffff00", "#ff8c00", "#00ff00", "#0000ff", "#8b4513", "#ff0000", "#000000"]
    }'
);

-- Recent Activities Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @AdminLayoutId,
    'Recent Activities',
    'activity-feed',
    0, 6, 8, 4,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "activities",
        "limit": 10,
        "showTimestamps": true,
        "showUserAvatars": true,
        "activityTypes": ["enrollment", "promotion", "payment", "class_attendance"]
    }'
);

-- Quick Actions Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @AdminLayoutId,
    'Quick Actions',
    'action-panel',
    8, 6, 4, 4,
    GETDATE(),
    GETDATE(),
    N'{
        "actions": [
            {"label": "Add New Student", "icon": "user-plus", "action": "navigate", "target": "/students/new"},
            {"label": "Create Class", "icon": "calendar-plus", "action": "navigate", "target": "/classes/new"},
            {"label": "Generate Report", "icon": "document-report", "action": "modal", "target": "reports"},
            {"label": "System Settings", "icon": "cog", "action": "navigate", "target": "/admin/settings"}
        ]
    }'
);

GO

-- ===============================================
-- Sample Widgets for Coach Dashboard
-- ===============================================

DECLARE @CoachLayoutId UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM DashboardLayouts WHERE Name = 'Coach Management Dashboard');

-- My Students Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @CoachLayoutId,
    'My Students',
    'metric',
    0, 0, 4, 2,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "coach_students",
        "metric": "total",
        "icon": "users",
        "color": "#3b82f6",
        "format": "number",
        "filter": "my_dojaang"
    }'
);

-- Today''s Classes Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @CoachLayoutId,
    'Today''s Classes',
    'metric',
    4, 0, 4, 2,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "classes",
        "metric": "today",
        "icon": "calendar-days",
        "color": "#10b981",
        "format": "number",
        "filter": "my_classes"
    }'
);

-- Upcoming Promotions Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @CoachLayoutId,
    'Upcoming Promotions',
    'metric',
    8, 0, 4, 2,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "promotions",
        "metric": "upcoming",
        "icon": "trophy",
        "color": "#f59e0b",
        "format": "number",
        "filter": "my_students"
    }'
);

-- Class Schedule Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @CoachLayoutId,
    'Weekly Schedule',
    'calendar',
    0, 2, 8, 6,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "class_schedule",
        "view": "week",
        "filter": "my_classes",
        "showStudentCount": true,
        "allowEdit": true
    }'
);

-- Student Progress Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @CoachLayoutId,
    'Student Progress',
    'progress-table',
    8, 2, 4, 6,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "student_progress",
        "filter": "my_students",
        "columns": ["name", "current_belt", "attendance", "next_promotion"],
        "sortBy": "next_promotion",
        "limit": 15
    }'
);

GO

-- ===============================================
-- Sample Widgets for Student Dashboard
-- ===============================================

DECLARE @StudentLayoutId UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM DashboardLayouts WHERE Name = 'Student Progress Dashboard');

-- Current Belt Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @StudentLayoutId,
    'Current Belt',
    'belt-display',
    0, 0, 4, 3,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "student_rank",
        "showBeltImage": true,
        "showPromotionDate": true,
        "showNextBelt": true
    }'
);

-- Training Hours Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @StudentLayoutId,
    'Training Hours This Month',
    'metric',
    4, 0, 4, 2,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "attendance",
        "metric": "monthly_hours",
        "icon": "clock",
        "color": "#3b82f6",
        "format": "hours"
    }'
);

-- Attendance Rate Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @StudentLayoutId,
    'Attendance Rate',
    'progress-ring',
    8, 0, 4, 3,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "attendance",
        "metric": "rate",
        "timeRange": "3months",
        "target": 80,
        "color": "#10b981"
    }'
);

-- Upcoming Classes Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @StudentLayoutId,
    'Upcoming Classes',
    'class-list',
    0, 3, 6, 4,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "student_classes",
        "timeRange": "week",
        "showInstructor": true,
        "showLocation": true,
        "limit": 10
    }'
);

-- Progress Tracking Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @StudentLayoutId,
    'Progress Tracking',
    'progress-chart',
    6, 3, 6, 4,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "student_progress",
        "metrics": ["attendance", "technique_scores", "sparring_performance"],
        "timeRange": "6months",
        "showTrends": true
    }'
);

-- Achievements Widget
INSERT INTO [dbo].[Widgets] ([Id], [LayoutId], [Title], [Type], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt], [Configuration])
VALUES 
(
    NEWID(),
    @StudentLayoutId,
    'Recent Achievements',
    'achievement-gallery',
    0, 7, 12, 3,
    GETDATE(),
    GETDATE(),
    N'{
        "dataSource": "student_achievements",
        "showBadges": true,
        "showDates": true,
        "limit": 8,
        "layout": "horizontal"
    }'
);

GO

PRINT 'Dashboard sample data inserted successfully!';
PRINT 'Created:';
PRINT '- 3 Dashboard Layouts (Admin, Coach, Student)';
PRINT '- 8 Admin Widgets (metrics, charts, activities, actions)';
PRINT '- 5 Coach Widgets (student management, schedule, progress)';
PRINT '- 6 Student Widgets (progress tracking, classes, achievements)';
PRINT 'Total: 19 Widgets across 3 dashboard layouts';
