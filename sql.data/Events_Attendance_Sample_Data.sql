-- Events and Attendance Sample Data for TKD Hub
-- This file creates sample events, tournaments, and attendance records

USE [TKDHubDb]
GO

-- ===============================================
-- Sample Events
-- ===============================================

-- Quarterly Belt Promotion Test
INSERT INTO [dbo].[Events] ([Name], [Description], [EventDate], [Location], [MaxParticipants], [RegistrationDeadline], [IsActive], [CreatedAt], [UpdatedAt])
VALUES 
(
    'Q4 2025 Belt Promotion Test',
    'Quarterly belt promotion examination for all eligible students. Testing will include forms (tul), sparring, breaking, and theory.',
    '2025-12-15 10:00:00',
    'Dojaang Principal - Buenos Aires',
    50,
    '2025-12-10 23:59:59',
    1,
    GETDATE(),
    GETDATE()
),
(
    'Regional Championship 2025',
    'Annual regional Taekwondo championship featuring sparring and forms competitions across all age categories.',
    '2025-11-20 09:00:00',
    'Estadio Luna Park - Buenos Aires',
    200,
    '2025-11-15 23:59:59',
    1,
    GETDATE(),
    GETDATE()
),
(
    'Master Workshop - Advanced Techniques',
    'Special workshop with Grand Master focusing on advanced kicking techniques and combat strategies.',
    '2025-10-28 14:00:00',
    'Dojaang Central - Córdoba',
    30,
    '2025-10-25 23:59:59',
    1,
    GETDATE(),
    GETDATE()
),
(
    'Youth Summer Camp 2026',
    'Week-long intensive training camp for youth students (ages 8-16) including technique training, games, and cultural activities.',
    '2026-01-15 08:00:00',
    'Camp Las Leñas - Mendoza',
    60,
    '2026-01-01 23:59:59',
    1,
    GETDATE(),
    GETDATE()
),
(
    'Black Belt Leadership Seminar',
    'Leadership development seminar for black belt students focusing on teaching skills and dojaang management.',
    '2025-11-05 13:00:00',
    'Dojaang Norte - Rosario',
    25,
    '2025-11-01 23:59:59',
    1,
    GETDATE(),
    GETDATE()
),
(
    'International Friendship Tournament',
    'Friendly tournament with visiting teams from Brazil and Chile. Focus on cultural exchange and sportsmanship.',
    '2026-03-22 10:00:00',
    'Polideportivo Municipal - La Plata',
    150,
    '2026-03-15 23:59:59',
    1,
    GETDATE(),
    GETDATE()
);

GO

-- ===============================================
-- Sample Training Class Schedules
-- ===============================================

-- Morning Classes (Kids)
INSERT INTO [dbo].[TrainingClasses] ([Name], [Description], [Schedule], [MaxStudents], [DojaangId], [InstructorId], [IsActive], [CreatedAt], [UpdatedAt], [StartTime], [EndTime], [DayOfWeek])
VALUES 
(
    'Little Tigers (Ages 4-6)',
    'Introduction to Taekwondo for very young children focusing on coordination, discipline, and basic movements.',
    'Monday, Wednesday, Friday - 9:00 AM',
    12,
    1,
    1, -- Coach ID
    1,
    GETDATE(),
    GETDATE(),
    '09:00:00',
    '09:45:00',
    'Monday,Wednesday,Friday'
),
(
    'Youth Beginners (Ages 7-12)',
    'Beginner level training for children focusing on basic techniques, forms, and Taekwondo philosophy.',
    'Tuesday, Thursday - 10:00 AM',
    15,
    1,
    1,
    1,
    GETDATE(),
    GETDATE(),
    '10:00:00',
    '11:00:00',
    'Tuesday,Thursday'
),
(
    'Junior Advanced (Ages 8-14)',
    'Advanced training for junior students with colored belts focusing on competition preparation.',
    'Monday, Wednesday, Friday - 4:00 PM',
    18,
    1,
    2,
    1,
    GETDATE(),
    GETDATE(),
    '16:00:00',
    '17:15:00',
    'Monday,Wednesday,Friday'
);

-- Evening Classes (Teens and Adults)
INSERT INTO [dbo].[TrainingClasses] ([Name], [Description], [Schedule], [MaxStudents], [DojaangId], [InstructorId], [IsActive], [CreatedAt], [UpdatedAt], [StartTime], [EndTime], [DayOfWeek])
VALUES 
(
    'Teen Competition Team',
    'High-intensity training for teenage competitors focusing on sparring and advanced techniques.',
    'Tuesday, Thursday, Saturday - 6:00 PM',
    20,
    1,
    1,
    1,
    GETDATE(),
    GETDATE(),
    '18:00:00',
    '19:30:00',
    'Tuesday,Thursday,Saturday'
),
(
    'Adult Beginners',
    'Introduction to Taekwondo for adult students with focus on fitness, self-defense, and stress relief.',
    'Monday, Wednesday - 7:00 PM',
    25,
    1,
    2,
    1,
    GETDATE(),
    GETDATE(),
    '19:00:00',
    '20:15:00',
    'Monday,Wednesday'
),
(
    'Black Belt Masters Class',
    'Advanced training exclusively for black belt students focusing on leadership and advanced techniques.',
    'Saturday - 8:00 AM',
    15,
    1,
    1,
    1,
    GETDATE(),
    GETDATE(),
    '08:00:00',
    '10:00:00',
    'Saturday'
);

GO

-- ===============================================
-- Sample Attendance Records (Last 30 days)
-- ===============================================

-- Generate attendance for the last 30 days
DECLARE @StartDate DATE = DATEADD(DAY, -30, GETDATE());
DECLARE @EndDate DATE = GETDATE();
DECLARE @CurrentDate DATE = @StartDate;

WHILE @CurrentDate <= @EndDate
BEGIN
    -- Monday, Wednesday, Friday - Little Tigers Class
    IF DATEPART(WEEKDAY, @CurrentDate) IN (2, 4, 6) -- Monday, Wednesday, Friday
    BEGIN
        -- Simulate 80% attendance rate
        INSERT INTO [dbo].[StudentClassAttendances] ([StudentClassId], [AttendanceDate], [Status], [Notes], [CreatedAt], [UpdatedAt])
        SELECT 
            sc.Id,
            @CurrentDate,
            CASE 
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 80 THEN 'PRESENT'
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 90 THEN 'ABSENT'
                ELSE 'LATE'
            END,
            CASE 
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 10 THEN 'Great improvement in kicks today!'
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 15 THEN 'Worked on balance exercises'
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 20 THEN 'Practiced first form (Tul)'
                ELSE NULL
            END,
            GETDATE(),
            GETDATE()
        FROM [dbo].[StudentClasses] sc
        WHERE sc.TrainingClassId = (SELECT Id FROM TrainingClasses WHERE Name = 'Little Tigers (Ages 4-6)')
        AND ABS(CHECKSUM(NEWID()) % 100) < 85; -- Random attendance
    END

    -- Tuesday, Thursday - Youth Beginners
    IF DATEPART(WEEKDAY, @CurrentDate) IN (3, 5) -- Tuesday, Thursday
    BEGIN
        INSERT INTO [dbo].[StudentClassAttendances] ([StudentClassId], [AttendanceDate], [Status], [Notes], [CreatedAt], [UpdatedAt])
        SELECT 
            sc.Id,
            @CurrentDate,
            CASE 
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 85 THEN 'PRESENT'
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 95 THEN 'ABSENT'
                ELSE 'LATE'
            END,
            CASE 
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 12 THEN 'Excellent focus during forms practice'
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 18 THEN 'Sparring practice - good progress'
                ELSE NULL
            END,
            GETDATE(),
            GETDATE()
        FROM [dbo].[StudentClasses] sc
        WHERE sc.TrainingClassId = (SELECT Id FROM TrainingClasses WHERE Name = 'Youth Beginners (Ages 7-12)')
        AND ABS(CHECKSUM(NEWID()) % 100) < 88;
    END

    -- Evening Classes
    IF DATEPART(WEEKDAY, @CurrentDate) IN (2, 4) -- Monday, Wednesday
    BEGIN
        INSERT INTO [dbo].[StudentClassAttendances] ([StudentClassId], [AttendanceDate], [Status], [Notes], [CreatedAt], [UpdatedAt])
        SELECT 
            sc.Id,
            @CurrentDate,
            CASE 
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 90 THEN 'PRESENT'
                ELSE 'ABSENT'
            END,
            CASE 
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 15 THEN 'Tournament preparation going well'
                WHEN ABS(CHECKSUM(NEWID()) % 100) < 25 THEN 'Strong performance in sparring'
                ELSE NULL
            END,
            GETDATE(),
            GETDATE()
        FROM [dbo].[StudentClasses] sc
        WHERE sc.TrainingClassId IN (
            SELECT Id FROM TrainingClasses WHERE Name IN ('Adult Beginners', 'Teen Competition Team')
        )
        AND ABS(CHECKSUM(NEWID()) % 100) < 92;
    END

    SET @CurrentDate = DATEADD(DAY, 1, @CurrentDate);
END

GO

-- ===============================================
-- Sample Promotion Records
-- ===============================================

-- Recent promotions (last 3 months)
INSERT INTO [dbo].[Promotions] ([StudentId], [FromRankId], [ToRankId], [PromotionDate], [ExaminerName], [TestScore], [Notes], [CreatedAt], [UpdatedAt])
VALUES 
-- Promoted from White to Yellow
(1, 1, 2, DATEADD(MONTH, -2, GETDATE()), 'Master Kim Jong-Su', 85, 'Good basic techniques, needs improvement in flexibility', GETDATE(), GETDATE()),
(2, 1, 2, DATEADD(MONTH, -2, GETDATE()), 'Master Kim Jong-Su', 92, 'Excellent attitude and strong kicks', GETDATE(), GETDATE()),
(3, 1, 2, DATEADD(MONTH, -1, GETDATE()), 'Master Lee Min-Ho', 78, 'Solid fundamentals, continue practicing forms', GETDATE(), GETDATE()),

-- Promoted from Yellow to Orange  
(4, 2, 3, DATEADD(MONTH, -2, GETDATE()), 'Master Kim Jong-Su', 88, 'Great improvement in forms and sparring', GETDATE(), GETDATE()),
(5, 2, 3, DATEADD(MONTH, -1, GETDATE()), 'Master Park Tae-Hwan', 91, 'Outstanding technique and discipline', GETDATE(), GETDATE()),

-- Promoted from Green to Blue
(6, 4, 5, DATEADD(MONTH, -3, GETDATE()), 'Master Kim Jong-Su', 94, 'Ready for advanced training, excellent sparring', GETDATE(), GETDATE()),
(7, 4, 5, DATEADD(MONTH, -1, GETDATE()), 'Master Lee Min-Ho', 87, 'Good progress in breaking techniques', GETDATE(), GETDATE()),

-- Black Belt Promotions
(8, 8, 9, DATEADD(MONTH, -3, GETDATE()), 'Grand Master Choi Hong-Hi', 96, 'Exceptional demonstration of all required techniques', GETDATE(), GETDATE()),
(9, 9, 10, DATEADD(MONTH, -6, GETDATE()), 'Grand Master Choi Hong-Hi', 93, 'Strong leadership qualities, approved for teaching', GETDATE(), GETDATE());

GO

-- ===============================================
-- Sample Payment Records
-- ===============================================

-- Monthly membership fees for the last 6 months
DECLARE @PaymentDate DATE = DATEADD(MONTH, -6, GETDATE());
DECLARE @PaymentEndDate DATE = GETDATE();

WHILE @PaymentDate <= @PaymentEndDate
BEGIN
    -- Generate payments for active students (simulate 90% payment rate)
    INSERT INTO [dbo].[Payments] ([UserId], [Amount], [PaymentDate], [PaymentMethod], [Status], [Description], [CreatedAt], [UpdatedAt])
    SELECT TOP (SELECT COUNT(*) * 0.9 FROM Users WHERE IsActive = 1)
        u.Id,
        CASE 
            WHEN u.DateOfBirth > DATEADD(YEAR, -12, GETDATE()) THEN 8500.00  -- Kids rate
            WHEN u.DateOfBirth > DATEADD(YEAR, -18, GETDATE()) THEN 9500.00  -- Teen rate
            ELSE 11000.00  -- Adult rate
        END,
        @PaymentDate,
        CASE ABS(CHECKSUM(NEWID()) % 4)
            WHEN 0 THEN 'CASH'
            WHEN 1 THEN 'CREDIT_CARD'
            WHEN 2 THEN 'DEBIT_CARD'
            ELSE 'BANK_TRANSFER'
        END,
        'COMPLETED',
        'Monthly membership fee - ' + FORMAT(@PaymentDate, 'MMMM yyyy'),
        @PaymentDate,
        @PaymentDate
    FROM Users u
    WHERE u.IsActive = 1
    ORDER BY NEWID();  -- Random selection

    SET @PaymentDate = DATEADD(MONTH, 1, @PaymentDate);
END

GO

-- ===============================================
-- Sample Blog Posts
-- ===============================================

INSERT INTO [dbo].[BlogPosts] ([Title], [Content], [Author], [PublishedAt], [IsPublished], [Tags], [CreatedAt], [UpdatedAt])
VALUES 
(
    'Benefits of Taekwondo Training for Children',
    'Taekwondo offers numerous benefits for children''s physical and mental development. Regular training improves flexibility, strength, and coordination while building confidence and discipline. Our structured program helps children learn respect, focus, and self-control through traditional Korean martial arts principles.',
    'Master Kim Jong-Su',
    DATEADD(DAY, -15, GETDATE()),
    1,
    'children,benefits,training,discipline',
    DATEADD(DAY, -15, GETDATE()),
    DATEADD(DAY, -15, GETDATE())
),
(
    'Preparing for Your First Belt Test',
    'Getting ready for your first belt promotion can be exciting and nerve-wracking. Here''s what you need to know: practice your forms daily, work on basic techniques, and remember that the test is about demonstrating your progress, not perfection. Come prepared, stay calm, and show your best effort.',
    'Master Lee Min-Ho',
    DATEADD(DAY, -8, GETDATE()),
    1,
    'belt test,promotion,preparation,tips',
    DATEADD(DAY, -8, GETDATE()),
    DATEADD(DAY, -8, GETDATE())
),
(
    'Tournament Success: Our Students Shine at Regional Championship',
    'We are proud to announce that our dojaang students achieved outstanding results at the recent Regional Championship. Our competitors brought home 5 gold medals, 3 silver medals, and 2 bronze medals across various categories. Congratulations to all participants for their dedication and sportsmanship!',
    'Master Park Tae-Hwan',
    DATEADD(DAY, -3, GETDATE()),
    1,
    'tournament,championship,success,medals,competition',
    DATEADD(DAY, -3, GETDATE()),
    DATEADD(DAY, -3, GETDATE())
),
(
    'The Philosophy Behind Taekwondo: More Than Just Kicks',
    'Taekwondo is built on five tenets: Courtesy, Integrity, Perseverance, Self-Control, and Indomitable Spirit. These principles guide not just our training but our daily lives. Understanding and embodying these values is as important as mastering the physical techniques of this beautiful martial art.',
    'Grand Master Choi Hong-Hi',
    DATEADD(DAY, -20, GETDATE()),
    1,
    'philosophy,tenets,courtesy,integrity,spirit,values',
    DATEADD(DAY, -20, GETDATE()),
    DATEADD(DAY, -20, GETDATE())
);

GO

PRINT 'Events and attendance sample data inserted successfully!';
PRINT 'Created:';
PRINT '- 6 Training Events (promotions, tournaments, workshops)';
PRINT '- 6 Training Class Schedules (different age groups and levels)';
PRINT '- 30 days of attendance records (with realistic attendance rates)';
PRINT '- 9 Promotion records (across different belt levels)';
PRINT '- 6 months of payment records (with 90% payment compliance)';
PRINT '- 4 Blog posts (training tips, philosophy, tournament results)';
PRINT '';
PRINT 'All sample data is ready for dashboard analytics and reporting!';
