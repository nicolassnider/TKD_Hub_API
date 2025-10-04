-- Add Sample Dashboard Widgets
-- This script adds sample widgets to the existing dashboard layouts

PRINT '=== Adding Sample Dashboard Widgets ===';

-- Check if widgets already exist
IF NOT EXISTS (SELECT 1 FROM Widgets WHERE Title LIKE '%Sample%')
BEGIN
    DECLARE @AdminLayoutId uniqueidentifier = (SELECT Id FROM DashboardLayouts WHERE UserRole = 'Admin' AND IsDefault = 1);
    DECLARE @CoachLayoutId uniqueidentifier = (SELECT Id FROM DashboardLayouts WHERE UserRole = 'Coach' AND IsDefault = 1);
    DECLARE @StudentLayoutId uniqueidentifier = (SELECT Id FROM DashboardLayouts WHERE UserRole = 'Student' AND IsDefault = 1);

    -- Admin Dashboard Widgets
    IF @AdminLayoutId IS NOT NULL
    BEGIN
        INSERT INTO [Widgets] ([Id], [DashboardLayoutId], [Title], [Type], [ConfigJson], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt])
        VALUES 
        (
            NEWID(),
            @AdminLayoutId,
            'Total Students',
            'Metric',
            '{"metric": "totalStudents", "icon": "people", "color": "primary"}',
            0, 0, 3, 2,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @AdminLayoutId,
            'Active Classes',
            'Metric',
            '{"metric": "activeClasses", "icon": "school", "color": "success"}',
            3, 0, 3, 2,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @AdminLayoutId,
            'Monthly Revenue',
            'Metric',
            '{"metric": "monthlyRevenue", "icon": "attach_money", "color": "warning"}',
            6, 0, 3, 2,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @AdminLayoutId,
            'Attendance Rate',
            'Metric',
            '{"metric": "attendanceRate", "icon": "trending_up", "color": "info"}',
            9, 0, 3, 2,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @AdminLayoutId,
            'Student Progress Chart',
            'Chart',
            '{"chartType": "line", "dataSource": "studentProgress", "timeRange": "30days"}',
            0, 2, 6, 4,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @AdminLayoutId,
            'Class Attendance Overview',
            'Chart',
            '{"chartType": "bar", "dataSource": "classAttendance", "timeRange": "7days"}',
            6, 2, 6, 4,
            GETDATE(),
            GETDATE()
        );

        PRINT '✓ Admin dashboard widgets created';
    END

    -- Coach Dashboard Widgets  
    IF @CoachLayoutId IS NOT NULL
    BEGIN
        INSERT INTO [Widgets] ([Id], [DashboardLayoutId], [Title], [Type], [ConfigJson], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt])
        VALUES 
        (
            NEWID(),
            @CoachLayoutId,
            'My Students',
            'Metric',
            '{"metric": "myStudents", "icon": "people", "color": "primary"}',
            0, 0, 4, 2,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @CoachLayoutId,
            'Today''s Classes',
            'Metric',
            '{"metric": "todayClasses", "icon": "today", "color": "success"}',
            4, 0, 4, 2,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @CoachLayoutId,
            'Attendance This Week',
            'Metric',
            '{"metric": "weeklyAttendance", "icon": "check_circle", "color": "info"}',
            8, 0, 4, 2,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @CoachLayoutId,
            'Class Schedule',
            'Calendar',
            '{"viewType": "week", "showMyClassesOnly": true}',
            0, 2, 8, 4,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @CoachLayoutId,
            'Recent Student Progress',
            'List',
            '{"dataSource": "recentProgress", "maxItems": 5}',
            8, 2, 4, 4,
            GETDATE(),
            GETDATE()
        );

        PRINT '✓ Coach dashboard widgets created';
    END

    -- Student Dashboard Widgets
    IF @StudentLayoutId IS NOT NULL
    BEGIN
        INSERT INTO [Widgets] ([Id], [DashboardLayoutId], [Title], [Type], [ConfigJson], [X], [Y], [Width], [Height], [CreatedAt], [UpdatedAt])
        VALUES 
        (
            NEWID(),
            @StudentLayoutId,
            'My Rank Progress',
            'Progress',
            '{"metric": "currentRank", "icon": "military_tech", "color": "warning"}',
            0, 0, 6, 2,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @StudentLayoutId,
            'Attendance Rate',
            'Metric',
            '{"metric": "myAttendanceRate", "icon": "trending_up", "color": "success"}',
            6, 0, 6, 2,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @StudentLayoutId,
            'My Class Schedule',
            'Calendar',
            '{"viewType": "week", "showMyClassesOnly": true}',
            0, 2, 8, 3,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @StudentLayoutId,
            'Upcoming Events',
            'List',
            '{"dataSource": "upcomingEvents", "maxItems": 3}',
            8, 2, 4, 3,
            GETDATE(),
            GETDATE()
        ),
        (
            NEWID(),
            @StudentLayoutId,
            'My Progress Timeline',
            'Card',
            '{"dataSource": "myProgress", "showPromotions": true}',
            0, 5, 12, 3,
            GETDATE(),
            GETDATE()
        );

        PRINT '✓ Student dashboard widgets created';
    END

    PRINT '✅ Sample dashboard widgets added successfully!';
END
ELSE
BEGIN
    PRINT '✓ Dashboard widgets already exist';
END

-- Show widget count
DECLARE @WidgetCount INT = (SELECT COUNT(*) FROM Widgets);
PRINT '• Total Dashboard Widgets: ' + CAST(@WidgetCount as VARCHAR(10));

GO
