-- Final Corrected Master Sample Data Initialization Script for TKD Hub Dashboard
-- This script initializes the database with comprehensive sample data for testing dashboard functionality
-- Updated to match actual database schema (Final Version)

USE [TKDHubDb]
GO

-- ===============================================
-- IMPORTANT: RUN THIS SCRIPT AFTER BASIC SETUP
-- ===============================================

PRINT '=== TKD Hub Dashboard Sample Data Initialization (Final) ===';
PRINT 'Starting initialization at: ' + CAST(GETDATE() as VARCHAR(50));
PRINT '';

-- ===============================================
-- STEP 1: Verify Prerequisites
-- ===============================================

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Users')
BEGIN
    PRINT 'ERROR: Users table not found. Please run database migrations first.';
    RETURN;
END

PRINT '✓ Prerequisites verified';

-- ===============================================
-- STEP 2: Create Sample Training Classes
-- ===============================================

PRINT 'Creating sample training classes...';

-- Check if sample classes already exist
IF NOT EXISTS (SELECT 1 FROM TrainingClasses WHERE Name LIKE '%Sample%')
BEGIN
    -- Get a sample coach and dojaang
    DECLARE @SampleCoachId INT = (SELECT TOP 1 u.Id FROM Users u 
                                 INNER JOIN UserUserRoles uur ON u.Id = uur.UserId 
                                 INNER JOIN UserRoles ur ON uur.UserRoleId = ur.Id 
                                 WHERE ur.Name = 'Coach' OR ur.Name = 'Admin'
                                 ORDER BY u.Id);
                                 
    DECLARE @SampleDojaangId INT = (SELECT TOP 1 Id FROM Dojaangs ORDER BY Id);

    IF @SampleCoachId IS NULL
    BEGIN
        -- If no coach found, get any user
        SET @SampleCoachId = (SELECT TOP 1 Id FROM Users ORDER BY Id);
        PRINT '! No coaches found - using first available user';
    END
    
    IF @SampleDojaangId IS NULL
    BEGIN
        PRINT '! No dojaangs found - skipping training class creation';
    END
    ELSE
    BEGIN
        INSERT INTO [TrainingClasses] ([Name], [Description], [Capacity], [DojaangId], [CoachId], [CreatedAt], [UpdatedAt])
        VALUES 
        (
            'Sample Little Dragons (Ages 4-7)',
            'Introductory Taekwondo for young children focusing on basic movements, coordination, and fun activities.',
            15,
            @SampleDojaangId,
            @SampleCoachId,
            GETDATE(),
            GETDATE()
        ),
        (
            'Sample Youth Warriors (Ages 8-14)',
            'Dynamic training for youth focusing on technique development, forms, and character building.',
            20,
            @SampleDojaangId,
            @SampleCoachId,
            GETDATE(),
            GETDATE()
        ),
        (
            'Sample Adult Fitness Taekwondo',
            'Adult-focused training combining traditional Taekwondo with fitness and stress relief.',
            25,
            @SampleDojaangId,
            @SampleCoachId,
            GETDATE(),
            GETDATE()
        );

        PRINT '✓ Sample training classes created';
    END
END
ELSE
BEGIN
    PRINT '✓ Training classes already exist';
END

-- ===============================================
-- STEP 3: Create Sample Events
-- ===============================================

PRINT 'Creating sample events...';

IF NOT EXISTS (SELECT 1 FROM Events WHERE Name LIKE '%Sample%')
BEGIN
    DECLARE @EventCoachId INT = (SELECT TOP 1 u.Id FROM Users u 
                                INNER JOIN UserUserRoles uur ON u.Id = uur.UserId 
                                INNER JOIN UserRoles ur ON uur.UserRoleId = ur.Id 
                                WHERE ur.Name = 'Coach' OR ur.Name = 'Admin'
                                ORDER BY u.Id);
                                
    DECLARE @EventDojaangId INT = (SELECT TOP 1 Id FROM Dojaangs ORDER BY Id);

    IF @EventCoachId IS NULL
        SET @EventCoachId = (SELECT TOP 1 Id FROM Users ORDER BY Id);

    IF @EventDojaangId IS NULL
    BEGIN
        PRINT '! No dojaangs found - skipping event creation';
    END
    ELSE
    BEGIN
        INSERT INTO [Events] ([Name], [Description], [Type], [StartDate], [EndDate], [Location], [CoachId], [DojaangId])
        VALUES 
        (
            'Sample Belt Promotion Test - Q4 2025',
            'Quarterly belt promotion examination for eligible students. Testing includes forms, techniques, sparring, and theory.',
            1, -- Tournament/Test type
            DATEADD(WEEK, 4, GETDATE()),  -- 4 weeks from now
            DATEADD(HOUR, 3, DATEADD(WEEK, 4, GETDATE())), -- 3 hour event
            'Main Training Hall',
            @EventCoachId,
            @EventDojaangId
        ),
        (
            'Sample Family Fun Tournament',
            'Friendly tournament for all ages with emphasis on participation, fun, and family involvement.',
            2, -- Tournament type
            DATEADD(WEEK, 8, GETDATE()),  -- 8 weeks from now
            DATEADD(HOUR, 5, DATEADD(WEEK, 8, GETDATE())), -- 5 hour event
            'Community Sports Center',
            @EventCoachId,
            @EventDojaangId
        ),
        (
            'Sample Black Belt Seminar',
            'Advanced training seminar for black belt students focusing on leadership and teaching skills.',
            3, -- Seminar type
            DATEADD(WEEK, 12, GETDATE()),  -- 12 weeks from now
            DATEADD(HOUR, 4, DATEADD(WEEK, 12, GETDATE())), -- 4 hour seminar
            'Advanced Training Facility',
            @EventCoachId,
            @EventDojaangId
        );

        PRINT '✓ Sample events created';
    END
END
ELSE
BEGIN
    PRINT '✓ Events already exist';
END

-- ===============================================
-- STEP 4: Generate Attendance Records
-- ===============================================

PRINT 'Generating sample attendance records...';

-- Check if we have student class enrollments first
IF EXISTS (SELECT 1 FROM StudentClasses)
BEGIN
    -- Generate attendance for the last 30 days
    DECLARE @StartDate DATE = DATEADD(DAY, -30, GETDATE());
    DECLARE @EndDate DATE = GETDATE();
    DECLARE @CurrentDate DATE = @StartDate;
    DECLARE @RecordsCreated INT = 0;

    WHILE @CurrentDate <= @EndDate
    BEGIN
        -- Create attendance records for each day (simulating realistic attendance patterns)
        INSERT INTO [StudentClassAttendances] ([StudentClassId], [AttendedAt], [Status], [Notes], [CreatedAt], [UpdatedAt])
        SELECT 
            sc.Id,
            DATEADD(HOUR, 17, @CurrentDate), -- 5 PM class time
            CASE 
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 85 THEN 1      -- 85% present (assuming 1 = Present)
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 95 THEN 0      -- 10% absent (assuming 0 = Absent)
                ELSE 2                                              -- 5% late (assuming 2 = Late)
            END,
            CASE 
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 15 THEN 'Great progress today!'
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 25 THEN 'Worked on forms'
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 30 THEN 'Sparring practice'
                ELSE NULL
            END,
            GETDATE(),
            GETDATE()
        FROM StudentClasses sc
        INNER JOIN TrainingClasses tc ON sc.TrainingClassId = tc.Id
        WHERE ABS(CHECKSUM(NEWID()) % 100) < 80  -- Not everyone attends every day
        AND NOT EXISTS (
            SELECT 1 FROM StudentClassAttendances sca
            WHERE sca.StudentClassId = sc.Id 
            AND CAST(sca.AttendedAt as DATE) = @CurrentDate
        );

        SET @RecordsCreated = @RecordsCreated + @@ROWCOUNT;
        SET @CurrentDate = DATEADD(DAY, 1, @CurrentDate);
    END

    PRINT '✓ Generated ' + CAST(@RecordsCreated as VARCHAR(10)) + ' attendance records';
END
ELSE
BEGIN
    PRINT '! No student class enrollments found - skipping attendance generation';
END

-- ===============================================
-- STEP 5: Create Sample Promotions
-- ===============================================

PRINT 'Creating sample promotion records...';

-- Create some recent promotions for dashboard display
IF NOT EXISTS (SELECT 1 FROM Promotions WHERE PromotionDate >= DATEADD(MONTH, -3, GETDATE()))
BEGIN
    DECLARE @PromotionCoachId INT = (SELECT TOP 1 u.Id FROM Users u 
                                    INNER JOIN UserUserRoles uur ON u.Id = uur.UserId 
                                    INNER JOIN UserRoles ur ON uur.UserRoleId = ur.Id 
                                    WHERE ur.Name = 'Coach' OR ur.Name = 'Admin'
                                    ORDER BY u.Id);
    
    DECLARE @PromotionDojaangId INT = (SELECT TOP 1 Id FROM Dojaangs ORDER BY Id);

    IF @PromotionCoachId IS NULL
        SET @PromotionCoachId = (SELECT TOP 1 Id FROM Users ORDER BY Id);

    IF @PromotionDojaangId IS NOT NULL
    BEGIN
        INSERT INTO [Promotions] ([StudentId], [RankId], [PromotionDate], [CoachId], [DojaangId], [Notes], [CreatedAt], [UpdatedAt])
        SELECT TOP 10
            u.Id,
            CASE 
                WHEN EXISTS (SELECT 1 FROM Ranks WHERE [Order] = (SELECT [Order] FROM Ranks WHERE Id = u.CurrentRankId) + 1)
                THEN (SELECT MIN(Id) FROM Ranks WHERE [Order] = (SELECT [Order] FROM Ranks WHERE Id = u.CurrentRankId) + 1)
                ELSE u.CurrentRankId  -- Stay at same rank if at maximum
            END,
            DATEADD(DAY, -ABS(CHECKSUM(NEWID()) % 90), GETDATE()),  -- Random date in last 3 months
            @PromotionCoachId,
            @PromotionDojaangId,
            CASE ABS(CHECKSUM(NEWID()) % 4)
                WHEN 0 THEN 'Excellent technique demonstration'
                WHEN 1 THEN 'Good improvement in forms and sparring'
                WHEN 2 THEN 'Strong performance, continue practicing'
                ELSE 'Well deserved promotion'
            END,
            GETDATE(),
            GETDATE()
        FROM Users u
        INNER JOIN Ranks r ON u.CurrentRankId = r.Id
        WHERE u.IsActive = 1 
        AND r.[Order] < (SELECT MAX([Order]) FROM Ranks)  -- Not at maximum rank
        ORDER BY NEWID();

        PRINT '✓ Sample promotion records created';
    END
    ELSE
    BEGIN
        PRINT '! No dojaangs found - skipping promotion creation';
    END
END
ELSE
BEGIN
    PRINT '✓ Promotion records already exist';
END

-- ===============================================
-- STEP 6: Create Sample Blog Posts
-- ===============================================

PRINT 'Creating sample blog posts...';

IF NOT EXISTS (SELECT 1 FROM BlogPosts WHERE Title LIKE '%Sample%')
BEGIN
    DECLARE @BlogAuthorId INT = (SELECT TOP 1 u.Id FROM Users u 
                                INNER JOIN UserUserRoles uur ON u.Id = uur.UserId 
                                INNER JOIN UserRoles ur ON uur.UserRoleId = ur.Id 
                                WHERE ur.Name = 'Admin'
                                ORDER BY u.Id);

    IF @BlogAuthorId IS NULL
        SET @BlogAuthorId = (SELECT TOP 1 Id FROM Users ORDER BY Id);

    INSERT INTO [BlogPosts] ([Title], [Content], [AuthorId], [CreatedAt], [UpdatedAt])
    VALUES 
    (
        'Sample: Welcome to Our New Dashboard System',
        'We are excited to announce the launch of our new dashboard system! This comprehensive tool will help students track their progress, coaches manage their classes more effectively, and administrators gain valuable insights into our dojaang''s performance. The dashboard includes real-time attendance tracking, progress monitoring, and detailed analytics.',
        @BlogAuthorId,
        DATEADD(DAY, -7, GETDATE()),
        DATEADD(DAY, -7, GETDATE())
    ),
    (
        'Sample: Upcoming Belt Promotion Guidelines',
        'As we approach our quarterly belt promotion test, we want to remind all students of the requirements and expectations. Students should demonstrate proficiency in required forms (tul), show good attendance records, and display the five tenets of Taekwondo in their daily practice. Remember, promotion is not just about technique - character development is equally important.',
        @BlogAuthorId,
        DATEADD(DAY, -3, GETDATE()),
        DATEADD(DAY, -3, GETDATE())
    ),
    (
        'Sample: Training Tips for Tournament Preparation',
        'For students interested in competing in our upcoming tournament, here are some essential training tips: Focus on cardio fitness, practice your forms daily, work on flexibility through regular stretching, and most importantly, maintain a positive mental attitude. Remember, tournaments are about personal growth and sportsmanship, not just winning.',
        @BlogAuthorId,
        DATEADD(DAY, -1, GETDATE()),
        DATEADD(DAY, -1, GETDATE())
    );

    PRINT '✓ Sample blog posts created';
END
ELSE
BEGIN
    PRINT '✓ Blog posts already exist';
END

-- ===============================================
-- STEP 7: Create Dashboard Layouts
-- ===============================================

PRINT 'Creating dashboard layouts...';

-- Check if dashboard layouts already exist
IF NOT EXISTS (SELECT 1 FROM DashboardLayouts WHERE Name LIKE '%Sample%')
BEGIN
    DECLARE @AdminUserId INT = (SELECT TOP 1 u.Id FROM Users u 
                               INNER JOIN UserUserRoles uur ON u.Id = uur.UserId 
                               INNER JOIN UserRoles ur ON uur.UserRoleId = ur.Id 
                               WHERE ur.Name = 'Admin'
                               ORDER BY u.Id);

    DECLARE @CoachUserId INT = (SELECT TOP 1 u.Id FROM Users u 
                               INNER JOIN UserUserRoles uur ON u.Id = uur.UserId 
                               INNER JOIN UserRoles ur ON uur.UserRoleId = ur.Id 
                               WHERE ur.Name = 'Coach'
                               ORDER BY u.Id);

    DECLARE @StudentUserId INT = (SELECT TOP 1 u.Id FROM Users u 
                                 INNER JOIN UserUserRoles uur ON u.Id = uur.UserId 
                                 INNER JOIN UserRoles ur ON uur.UserRoleId = ur.Id 
                                 WHERE ur.Name = 'Student'
                                 ORDER BY u.Id);

    -- Create Admin Dashboard Layout
    INSERT INTO [DashboardLayouts] ([Id], [Name], [Description], [UserRole], [IsDefault], [UserId], [CreatedAt], [UpdatedAt])
    VALUES 
    (
        NEWID(),
        'Sample Admin Dashboard',
        'Comprehensive admin view with key metrics and analytics',
        'Admin',
        1,
        @AdminUserId,
        GETDATE(),
        GETDATE()
    );

    -- Create Coach Dashboard Layout
    INSERT INTO [DashboardLayouts] ([Id], [Name], [Description], [UserRole], [IsDefault], [UserId], [CreatedAt], [UpdatedAt])
    VALUES 
    (
        NEWID(),
        'Sample Coach Dashboard',
        'Coach-focused view showing class management and student progress',
        'Coach',
        1,
        @CoachUserId,
        GETDATE(),
        GETDATE()
    );

    -- Create Student Dashboard Layout
    INSERT INTO [DashboardLayouts] ([Id], [Name], [Description], [UserRole], [IsDefault], [UserId], [CreatedAt], [UpdatedAt])
    VALUES 
    (
        NEWID(),
        'Sample Student Dashboard',
        'Student view showing personal progress and class information',
        'Student',
        1,
        @StudentUserId,
        GETDATE(),
        GETDATE()
    );

    PRINT '✓ Dashboard layouts created';
END
ELSE
BEGIN
    PRINT '✓ Dashboard layouts already exist';
END

-- ===============================================
-- STEP 8: Summary
-- ===============================================

PRINT '';
PRINT '=== Sample Data Initialization Complete ===';
PRINT 'Summary of data in database:';

-- Count students
DECLARE @StudentCount INT = (SELECT COUNT(*) FROM Users WHERE IsActive = 1);
PRINT '• Active Students: ' + CAST(@StudentCount as VARCHAR(10));

-- Count classes  
DECLARE @ClassCount INT = (SELECT COUNT(*) FROM TrainingClasses);
PRINT '• Training Classes: ' + CAST(@ClassCount as VARCHAR(10));

-- Count events
DECLARE @EventCount INT = (SELECT COUNT(*) FROM Events);
PRINT '• Events: ' + CAST(@EventCount as VARCHAR(10));

-- Count attendance records
DECLARE @AttendanceCount INT = (SELECT COUNT(*) FROM StudentClassAttendances WHERE AttendedAt >= DATEADD(DAY, -30, GETDATE()));
PRINT '• Attendance Records (Last 30 days): ' + CAST(@AttendanceCount as VARCHAR(10));

-- Count promotions
DECLARE @PromotionCount INT = (SELECT COUNT(*) FROM Promotions WHERE PromotionDate >= DATEADD(MONTH, -6, GETDATE()));
PRINT '• Recent Promotions (Last 6 months): ' + CAST(@PromotionCount as VARCHAR(10));

-- Count blog posts
DECLARE @BlogCount INT = (SELECT COUNT(*) FROM BlogPosts);
PRINT '• Blog Posts: ' + CAST(@BlogCount as VARCHAR(10));

-- Count dashboard layouts
DECLARE @DashboardCount INT = (SELECT COUNT(*) FROM DashboardLayouts);
PRINT '• Dashboard Layouts: ' + CAST(@DashboardCount as VARCHAR(10));

PRINT '';
PRINT '✅ Your TKD Hub database is now populated with sample data!';
PRINT '✅ Dashboard system is ready for testing.';
PRINT '';
PRINT 'Initialization completed at: ' + CAST(GETDATE() as VARCHAR(50));

GO
