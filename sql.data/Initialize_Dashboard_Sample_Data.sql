-- Master Sample Data Initialization Script for TKD Hub Dashboard
-- This script initializes the database with comprehensive sample data for testing dashboard functionality

USE [TKDHubDb]
GO

-- ===============================================
-- IMPORTANT: RUN THIS SCRIPT AFTER BASIC SETUP
-- ===============================================
-- Prerequisites:
-- 1. Database schema is created (run migrations first)
-- 2. Basic reference data is loaded (Ranks, Roles, etc.)
-- 3. At least one Dojaang and initial users exist
-- ===============================================

PRINT '=== TKD Hub Dashboard Sample Data Initialization ===';
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

IF NOT EXISTS (SELECT 1 FROM Ranks)
BEGIN
    PRINT 'ERROR: No ranks found. Please ensure basic reference data is loaded.';
    RETURN;
END

IF NOT EXISTS (SELECT 1 FROM Dojaangs)
BEGIN
    PRINT 'ERROR: No dojaangs found. Please create at least one dojaang first.';
    RETURN;
END

PRINT '✓ Prerequisites verified';

-- ===============================================
-- STEP 2: Create Sample Training Classes
-- ===============================================

PRINT 'Creating sample training classes...';

-- Check if classes already exist
IF NOT EXISTS (SELECT 1 FROM TrainingClasses WHERE Name LIKE '%Sample%')
BEGIN
    INSERT INTO [TrainingClasses] ([Name], [Description], [Schedule], [MaxStudents], [DojaangId], [InstructorId], [IsActive], [CreatedAt], [UpdatedAt], [StartTime], [EndTime], [DayOfWeek])
    VALUES 
    (
        'Sample Little Dragons (Ages 4-7)',
        'Introductory Taekwondo for young children focusing on basic movements, coordination, and fun activities.',
        'Monday, Wednesday, Friday - 4:00 PM',
        15,
        (SELECT TOP 1 Id FROM Dojaangs ORDER BY Id),
        (SELECT TOP 1 Id FROM Users WHERE Id IN (SELECT UserId FROM UserUserRoles uur INNER JOIN UserRoles ur ON uur.RoleId = ur.Id WHERE ur.Name = 'Coach') ORDER BY Id),
        1,
        GETDATE(),
        GETDATE(),
        '16:00:00',
        '16:45:00',
        'Monday,Wednesday,Friday'
    ),
    (
        'Sample Youth Warriors (Ages 8-14)',
        'Dynamic training for youth focusing on technique development, forms, and character building.',
        'Tuesday, Thursday, Saturday - 5:00 PM',
        20,
        (SELECT TOP 1 Id FROM Dojaangs ORDER BY Id),
        (SELECT TOP 1 Id FROM Users WHERE Id IN (SELECT UserId FROM UserUserRoles uur INNER JOIN UserRoles ur ON uur.RoleId = ur.Id WHERE ur.Name = 'Coach') ORDER BY Id),
        1,
        GETDATE(),
        GETDATE(),
        '17:00:00',
        '18:15:00',
        'Tuesday,Thursday,Saturday'
    ),
    (
        'Sample Adult Fitness Taekwondo',
        'Adult-focused training combining traditional Taekwondo with fitness and stress relief.',
        'Monday, Wednesday - 7:00 PM',
        25,
        (SELECT TOP 1 Id FROM Dojaangs ORDER BY Id),
        (SELECT TOP 1 Id FROM Users WHERE Id IN (SELECT UserId FROM UserUserRoles uur INNER JOIN UserRoles ur ON uur.RoleId = ur.Id WHERE ur.Name = 'Coach') ORDER BY Id),
        1,
        GETDATE(),
        GETDATE(),
        '19:00:00',
        '20:15:00',
        'Monday,Wednesday'
    );

    PRINT '✓ Sample training classes created';
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
    INSERT INTO [Events] ([Name], [Description], [EventDate], [Location], [MaxParticipants], [RegistrationDeadline], [IsActive], [CreatedAt], [UpdatedAt])
    VALUES 
    (
        'Sample Belt Promotion Test - Q4 2025',
        'Quarterly belt promotion examination for eligible students. Testing includes forms, techniques, sparring, and theory.',
        DATEADD(WEEK, 4, GETDATE()),  -- 4 weeks from now
        'Main Training Hall',
        50,
        DATEADD(WEEK, 3, GETDATE()),  -- Registration closes 1 week before
        1,
        GETDATE(),
        GETDATE()
    ),
    (
        'Sample Family Fun Tournament',
        'Friendly tournament for all ages with emphasis on participation, fun, and family involvement.',
        DATEADD(WEEK, 8, GETDATE()),  -- 8 weeks from now
        'Community Sports Center',
        100,
        DATEADD(WEEK, 6, GETDATE()),
        1,
        GETDATE(),
        GETDATE()
    ),
    (
        'Sample Black Belt Seminar',
        'Advanced training seminar for black belt students focusing on leadership and teaching skills.',
        DATEADD(WEEK, 12, GETDATE()),  -- 12 weeks from now
        'Advanced Training Facility',
        30,
        DATEADD(WEEK, 10, GETDATE()),
        1,
        GETDATE(),
        GETDATE()
    );

    PRINT '✓ Sample events created';
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
        INSERT INTO [StudentClassAttendances] ([StudentClassId], [AttendanceDate], [Status], [Notes], [CreatedAt], [UpdatedAt])
        SELECT 
            sc.Id,
            @CurrentDate,
            CASE 
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 85 THEN 'PRESENT'      -- 85% present
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 95 THEN 'ABSENT'       -- 10% absent
                ELSE 'LATE'                                                  -- 5% late
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
        WHERE tc.IsActive = 1
        AND ABS(CHECKSUM(NEWID()) % 100) < 80  -- Not everyone attends every day
        AND NOT EXISTS (
            SELECT 1 FROM StudentClassAttendances 
            WHERE StudentClassId = sc.Id AND AttendanceDate = @CurrentDate
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
-- STEP 5: Create Sample Payment Records
-- ===============================================

PRINT 'Creating sample payment records...';

-- Generate monthly payments for the last 6 months
DECLARE @PaymentMonth DATE = DATEADD(MONTH, -6, GETDATE());
DECLARE @PaymentEndDate DATE = GETDATE();
DECLARE @PaymentsCreated INT = 0;

WHILE @PaymentMonth <= @PaymentEndDate
BEGIN
    -- Create payments for 90% of active students each month
    INSERT INTO [Payments] ([UserId], [Amount], [PaymentDate], [PaymentMethod], [Status], [Description], [CreatedAt], [UpdatedAt])
    SELECT 
        u.Id,
        CASE 
            WHEN DATEDIFF(YEAR, u.DateOfBirth, GETDATE()) < 12 THEN 8500.00    -- Kids rate
            WHEN DATEDIFF(YEAR, u.DateOfBirth, GETDATE()) < 18 THEN 9500.00    -- Teen rate  
            ELSE 11500.00                                                       -- Adult rate
        END,
        DATEADD(DAY, ABS(CHECKSUM(NEWID()) % 28), @PaymentMonth),  -- Random day in month
        CASE ABS(CHECKSUM(NEWID()) % 4)
            WHEN 0 THEN 'CASH'
            WHEN 1 THEN 'CREDIT_CARD'
            WHEN 2 THEN 'DEBIT_CARD'
            ELSE 'BANK_TRANSFER'
        END,
        'COMPLETED',
        'Monthly membership fee - ' + FORMAT(@PaymentMonth, 'MMMM yyyy'),
        @PaymentMonth,
        @PaymentMonth
    FROM (
        SELECT TOP (SELECT CAST(COUNT(*) * 0.9 as INT) FROM Users WHERE IsActive = 1) *
        FROM Users 
        WHERE IsActive = 1
        ORDER BY NEWID()
    ) u
    WHERE NOT EXISTS (
        SELECT 1 FROM Payments p 
        WHERE p.UserId = u.Id 
        AND YEAR(p.PaymentDate) = YEAR(@PaymentMonth)
        AND MONTH(p.PaymentDate) = MONTH(@PaymentMonth)
    );

    SET @PaymentsCreated = @PaymentsCreated + @@ROWCOUNT;
    SET @PaymentMonth = DATEADD(MONTH, 1, @PaymentMonth);
END

PRINT '✓ Generated ' + CAST(@PaymentsCreated as VARCHAR(10)) + ' payment records';

-- ===============================================
-- STEP 6: Create Sample Promotions
-- ===============================================

PRINT 'Creating sample promotion records...';

-- Create some recent promotions for dashboard display
IF NOT EXISTS (SELECT 1 FROM Promotions WHERE CreatedAt >= DATEADD(MONTH, -3, GETDATE()))
BEGIN
    INSERT INTO [Promotions] ([StudentId], [FromRankId], [ToRankId], [PromotionDate], [ExaminerName], [TestScore], [Notes], [CreatedAt], [UpdatedAt])
    SELECT TOP 10
        u.Id,
        u.CurrentRankId,
        CASE 
            WHEN u.CurrentRankId < (SELECT MAX(Id) FROM Ranks WHERE Level = u.CurrentRankId + 1) 
            THEN (SELECT MIN(Id) FROM Ranks WHERE Level = (SELECT Level FROM Ranks WHERE Id = u.CurrentRankId) + 1)
            ELSE u.CurrentRankId  -- Already at highest rank
        END,
        DATEADD(DAY, -ABS(CHECKSUM(NEWID()) % 90), GETDATE()),  -- Random date in last 3 months
        CASE ABS(CHECKSUM(NEWID()) % 3)
            WHEN 0 THEN 'Master Kim Jong-Su'
            WHEN 1 THEN 'Master Lee Min-Ho'
            ELSE 'Master Park Tae-Hwan'
        END,
        75 + ABS(CHECKSUM(NEWID()) % 25),  -- Score between 75-100
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
    AND r.Level < 10  -- Not at maximum rank
    ORDER BY NEWID();

    PRINT '✓ Sample promotion records created';
END
ELSE
BEGIN
    PRINT '✓ Promotion records already exist';
END

-- ===============================================
-- STEP 7: Create Sample Blog Posts
-- ===============================================

PRINT 'Creating sample blog posts...';

IF NOT EXISTS (SELECT 1 FROM BlogPosts WHERE Title LIKE '%Sample%')
BEGIN
    INSERT INTO [BlogPosts] ([Title], [Content], [Author], [PublishedAt], [IsPublished], [Tags], [CreatedAt], [UpdatedAt])
    VALUES 
    (
        'Sample: Welcome to Our New Dashboard System',
        'We are excited to announce the launch of our new dashboard system! This comprehensive tool will help students track their progress, coaches manage their classes more effectively, and administrators gain valuable insights into our dojaang''s performance. The dashboard includes real-time attendance tracking, progress monitoring, and detailed analytics.',
        'System Administrator',
        DATEADD(DAY, -7, GETDATE()),
        1,
        'dashboard,system,technology,progress tracking',
        DATEADD(DAY, -7, GETDATE()),
        DATEADD(DAY, -7, GETDATE())
    ),
    (
        'Sample: Upcoming Belt Promotion Guidelines',
        'As we approach our quarterly belt promotion test, we want to remind all students of the requirements and expectations. Students should demonstrate proficiency in required forms (tul), show good attendance records, and display the five tenets of Taekwondo in their daily practice. Remember, promotion is not just about technique - character development is equally important.',
        'Head Instructor',
        DATEADD(DAY, -3, GETDATE()),
        1,
        'promotion,belt test,requirements,character,tenets',
        DATEADD(DAY, -3, GETDATE()),
        DATEADD(DAY, -3, GETDATE()
        )
    ),
    (
        'Sample: Training Tips for Tournament Preparation',
        'For students interested in competing in our upcoming tournament, here are some essential training tips: Focus on cardio fitness, practice your forms daily, work on flexibility through regular stretching, and most importantly, maintain a positive mental attitude. Remember, tournaments are about personal growth and sportsmanship, not just winning.',
        'Competition Coach',
        DATEADD(DAY, -1, GETDATE()),
        1,
        'tournament,competition,training tips,fitness,mental preparation',
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
-- STEP 8: Update Statistics and Summary
-- ===============================================

PRINT '';
PRINT '=== Sample Data Initialization Complete ===';
PRINT 'Summary of created data:';

-- Count students
DECLARE @StudentCount INT = (SELECT COUNT(*) FROM Users WHERE IsActive = 1);
PRINT '• Active Students: ' + CAST(@StudentCount as VARCHAR(10));

-- Count classes  
DECLARE @ClassCount INT = (SELECT COUNT(*) FROM TrainingClasses WHERE IsActive = 1);
PRINT '• Active Classes: ' + CAST(@ClassCount as VARCHAR(10));

-- Count events
DECLARE @EventCount INT = (SELECT COUNT(*) FROM Events WHERE IsActive = 1);
PRINT '• Upcoming Events: ' + CAST(@EventCount as VARCHAR(10));

-- Count attendance records
DECLARE @AttendanceCount INT = (SELECT COUNT(*) FROM StudentClassAttendances WHERE AttendanceDate >= DATEADD(DAY, -30, GETDATE()));
PRINT '• Attendance Records (Last 30 days): ' + CAST(@AttendanceCount as VARCHAR(10));

-- Count payments
DECLARE @PaymentCount INT = (SELECT COUNT(*) FROM Payments WHERE Status = 'COMPLETED' AND PaymentDate >= DATEADD(MONTH, -6, GETDATE()));
PRINT '• Payment Records (Last 6 months): ' + CAST(@PaymentCount as VARCHAR(10));

-- Count promotions
DECLARE @PromotionCount INT = (SELECT COUNT(*) FROM Promotions WHERE CreatedAt >= DATEADD(MONTH, -6, GETDATE()));
PRINT '• Recent Promotions (Last 6 months): ' + CAST(@PromotionCount as VARCHAR(10));

-- Count blog posts
DECLARE @BlogCount INT = (SELECT COUNT(*) FROM BlogPosts WHERE IsPublished = 1);
PRINT '• Published Blog Posts: ' + CAST(@BlogCount as VARCHAR(10));

PRINT '';
PRINT '✅ Your TKD Hub database is now populated with comprehensive sample data!';
PRINT '✅ Dashboard widgets can now display meaningful analytics and metrics.';
PRINT '✅ Run the Analytics_Dashboard_Queries.sql file to test dashboard data retrieval.';
PRINT '';
PRINT 'Initialization completed at: ' + CAST(GETDATE() as VARCHAR(50));

GO
