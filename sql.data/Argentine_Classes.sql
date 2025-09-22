-- Argentine Training Classes for TKD Hub
-- This file creates sample training classes with schedules for Argentine dojangs

USE [TKDHubDb]
GO

PRINT 'Creating Argentine Training Classes...'
PRINT '===================================='

-- ==========================================
-- STEP 1: Insert Training Classes
-- ==========================================

-- Get dojang and coach information for assignment
DECLARE @DojaangCoaches TABLE (
    DojaangId INT,
    DojaangName NVARCHAR(255),
    CoachId INT,
    CoachName NVARCHAR(255)
);

INSERT INTO @DojaangCoaches
SELECT 
    d.Id,
    d.Name,
    d.CoachId,
    c.FirstName + ' ' + c.LastName
FROM [dbo].[Dojaangs] d
LEFT JOIN [dbo].[Users] c ON d.CoachId = c.Id
WHERE d.Name NOT IN ('Dojang 1', 'Dojang 2') AND d.CoachId IS NOT NULL;

-- Insert training classes for each dojang
INSERT INTO [dbo].[TrainingClasses] ([Name], [DojaangId], [CoachId], [CreatedAt], [UpdatedAt])
SELECT 
    'Infantiles (6-9 años)' as Name,
    DojaangId,
    CoachId,
    '2024-01-15' as CreatedAt,
    '2024-09-20' as UpdatedAt
FROM @DojaangCoaches

UNION ALL

SELECT 
    'Juveniles (10-14 años)' as Name,
    DojaangId,
    CoachId,
    '2024-01-15' as CreatedAt,
    '2024-09-20' as UpdatedAt
FROM @DojaangCoaches

UNION ALL

SELECT 
    'Adolescentes (15-17 años)' as Name,
    DojaangId,
    CoachId,
    '2024-01-15' as CreatedAt,
    '2024-09-20' as UpdatedAt
FROM @DojaangCoaches

UNION ALL

SELECT 
    'Adultos Principiantes' as Name,
    DojaangId,
    CoachId,
    '2024-01-15' as CreatedAt,
    '2024-09-20' as UpdatedAt
FROM @DojaangCoaches

UNION ALL

SELECT 
    'Adultos Avanzados' as Name,
    DojaangId,
    CoachId,
    '2024-01-15' as CreatedAt,
    '2024-09-20' as UpdatedAt
FROM @DojaangCoaches;

PRINT 'Training classes created successfully!'

-- ==========================================
-- STEP 2: Create Class Schedules
-- ==========================================
PRINT 'Creating class schedules...'

-- Create a cursor to assign schedules to each class
DECLARE @class_cursor CURSOR;
DECLARE @class_id INT;
DECLARE @class_name NVARCHAR(255);
DECLARE @dojang_id INT;
DECLARE @day_offset INT = 0;

SET @class_cursor = CURSOR FOR
SELECT tc.Id, tc.Name, tc.DojaangId
FROM [dbo].[TrainingClasses] tc
WHERE tc.Name LIKE '%años%' OR tc.Name LIKE 'Adultos%'
ORDER BY tc.DojaangId, tc.Name;

OPEN @class_cursor;
FETCH NEXT FROM @class_cursor INTO @class_id, @class_name, @dojang_id;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Assign different schedule patterns based on class type
    IF @class_name LIKE 'Infantiles%'
    BEGIN
        -- Monday and Wednesday 16:00-17:00
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 1, '16:00:00', '17:00:00', '2024-01-15', '2024-09-20'),  -- Monday
        (@class_id, 3, '16:00:00', '17:00:00', '2024-01-15', '2024-09-20');  -- Wednesday
    END
    ELSE IF @class_name LIKE 'Juveniles%'
    BEGIN
        -- Tuesday and Thursday 17:00-18:30
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 2, '17:00:00', '18:30:00', '2024-01-15', '2024-09-20'),  -- Tuesday
        (@class_id, 4, '17:00:00', '18:30:00', '2024-01-15', '2024-09-20');  -- Thursday
    END
    ELSE IF @class_name LIKE 'Adolescentes%'
    BEGIN
        -- Monday and Friday 18:30-20:00
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 1, '18:30:00', '20:00:00', '2024-01-15', '2024-09-20'),  -- Monday
        (@class_id, 5, '18:30:00', '20:00:00', '2024-01-15', '2024-09-20');  -- Friday
    END
    ELSE IF @class_name LIKE 'Adultos Principiantes%'
    BEGIN
        -- Tuesday and Thursday 19:00-20:30
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 2, '19:00:00', '20:30:00', '2024-01-15', '2024-09-20'),  -- Tuesday
        (@class_id, 4, '19:00:00', '20:30:00', '2024-01-15', '2024-09-20');  -- Thursday
    END
    ELSE IF @class_name LIKE 'Adultos Avanzados%'
    BEGIN
        -- Wednesday and Saturday 20:30-22:00
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 3, '20:30:00', '22:00:00', '2024-01-15', '2024-09-20'),  -- Wednesday
        (@class_id, 6, '09:00:00', '10:30:00', '2024-01-15', '2024-09-20');  -- Saturday morning
    END

    FETCH NEXT FROM @class_cursor INTO @class_id, @class_name, @dojang_id;
END

CLOSE @class_cursor;
DEALLOCATE @class_cursor;

PRINT 'Class schedules created successfully!'

-- ==========================================
-- STEP 3: Assign Students to Classes
-- ==========================================
PRINT 'Assigning students to appropriate classes...'

-- Assign children (born 2015-2018) to Infantiles classes
INSERT INTO [dbo].[StudentClasses] ([StudentId], [TrainingClassId], [Date], [Attended], [CreatedAt], [UpdatedAt])
SELECT 
    s.Id as StudentId,
    tc.Id as TrainingClassId,
    '2024-09-20' as Date,
    CASE WHEN ABS(CHECKSUM(NEWID()) % 10) < 8 THEN 1 ELSE 0 END as Attended, -- 80% attendance rate
    '2024-09-20' as CreatedAt,
    '2024-09-20' as UpdatedAt
FROM [dbo].[Users] s
INNER JOIN [dbo].[UserUserRoles] sur ON s.Id = sur.UserId AND sur.UserRoleId = 3 -- Students
INNER JOIN [dbo].[TrainingClasses] tc ON s.DojaangId = tc.DojaangId
WHERE YEAR(s.DateOfBirth) BETWEEN 2015 AND 2018
AND tc.Name = 'Infantiles (6-9 años)'
AND s.Email LIKE '%@gmail.com';

-- Assign pre-teens (born 2010-2014) to Juveniles classes  
INSERT INTO [dbo].[StudentClasses] ([StudentId], [TrainingClassId], [Date], [Attended], [CreatedAt], [UpdatedAt])
SELECT 
    s.Id as StudentId,
    tc.Id as TrainingClassId,
    '2024-09-20' as Date,
    CASE WHEN ABS(CHECKSUM(NEWID()) % 10) < 8 THEN 1 ELSE 0 END as Attended,
    '2024-09-20' as CreatedAt,
    '2024-09-20' as UpdatedAt
FROM [dbo].[Users] s
INNER JOIN [dbo].[UserUserRoles] sur ON s.Id = sur.UserId AND sur.UserRoleId = 3
INNER JOIN [dbo].[TrainingClasses] tc ON s.DojaangId = tc.DojaangId
WHERE YEAR(s.DateOfBirth) BETWEEN 2010 AND 2014
AND tc.Name = 'Juveniles (10-14 años)'
AND s.Email LIKE '%@gmail.com';

-- Assign teenagers (born 2007-2009) to Adolescentes classes
INSERT INTO [dbo].[StudentClasses] ([StudentId], [TrainingClassId], [Date], [Attended], [CreatedAt], [UpdatedAt])
SELECT 
    s.Id as StudentId,
    tc.Id as TrainingClassId,
    '2024-09-20' as Date,
    CASE WHEN ABS(CHECKSUM(NEWID()) % 10) < 8 THEN 1 ELSE 0 END as Attended,
    '2024-09-20' as CreatedAt,
    '2024-09-20' as UpdatedAt
FROM [dbo].[Users] s
INNER JOIN [dbo].[UserUserRoles] sur ON s.Id = sur.UserId AND sur.UserRoleId = 3
INNER JOIN [dbo].[TrainingClasses] tc ON s.DojaangId = tc.DojaangId
WHERE YEAR(s.DateOfBirth) BETWEEN 2007 AND 2009
AND tc.Name = 'Adolescentes (15-17 años)'
AND s.Email LIKE '%@gmail.com';

-- Assign young adults with lower ranks to Principiantes
INSERT INTO [dbo].[StudentClasses] ([StudentId], [TrainingClassId], [Date], [Attended], [CreatedAt], [UpdatedAt])
SELECT 
    s.Id as StudentId,
    tc.Id as TrainingClassId,
    '2024-09-20' as Date,
    CASE WHEN ABS(CHECKSUM(NEWID()) % 10) < 8 THEN 1 ELSE 0 END as Attended,
    '2024-09-20' as CreatedAt,
    '2024-09-20' as UpdatedAt
FROM [dbo].[Users] s
INNER JOIN [dbo].[UserUserRoles] sur ON s.Id = sur.UserId AND sur.UserRoleId = 3
INNER JOIN [dbo].[TrainingClasses] tc ON s.DojaangId = tc.DojaangId
WHERE YEAR(s.DateOfBirth) <= 2006
AND s.CurrentRankId BETWEEN 1 AND 6  -- White to Purple belt
AND tc.Name = 'Adultos Principiantes'
AND s.Email LIKE '%@gmail.com';

-- Assign advanced students to Avanzados classes
INSERT INTO [dbo].[StudentClasses] ([StudentId], [TrainingClassId], [Date], [Attended], [CreatedAt], [UpdatedAt])
SELECT 
    s.Id as StudentId,
    tc.Id as TrainingClassId,
    '2024-09-20' as Date,
    CASE WHEN ABS(CHECKSUM(NEWID()) % 10) < 9 THEN 1 ELSE 0 END as Attended, -- 90% attendance for advanced
    '2024-09-20' as CreatedAt,
    '2024-09-20' as UpdatedAt
FROM [dbo].[Users] s
INNER JOIN [dbo].[UserUserRoles] sur ON s.Id = sur.UserId AND sur.UserRoleId = 3
INNER JOIN [dbo].[TrainingClasses] tc ON s.DojaangId = tc.DojaangId
WHERE YEAR(s.DateOfBirth) <= 2006
AND s.CurrentRankId >= 7  -- Red belt and above
AND tc.Name = 'Adultos Avanzados'
AND s.Email LIKE '%@gmail.com';

PRINT 'Students assigned to classes successfully!'

-- ==========================================
-- STEP 4: Create Additional Class Sessions
-- ==========================================
PRINT 'Creating additional class session records...'

-- Create class attendance for the past month (simulate regular training)
DECLARE @session_date DATE = DATEADD(DAY, -30, GETDATE());
DECLARE @end_date DATE = GETDATE();

WHILE @session_date <= @end_date
BEGIN
    -- Only create sessions for weekdays that match class schedules
    DECLARE @day_of_week INT = DATEPART(WEEKDAY, @session_date) - 1; -- Convert to 0-6 (Monday=1 in our DB)
    IF @day_of_week = 0 SET @day_of_week = 7; -- Sunday adjustment
    
    IF @day_of_week BETWEEN 1 AND 6  -- Monday to Saturday
    BEGIN
        INSERT INTO [dbo].[StudentClasses] ([StudentId], [TrainingClassId], [Date], [Attended], [CreatedAt], [UpdatedAt])
        SELECT 
            sc.StudentId,
            sc.TrainingClassId,
            @session_date as Date,
            CASE 
                WHEN ABS(CHECKSUM(NEWID()) % 10) < 8 THEN 1 
                ELSE 0 
            END as Attended,
            @session_date as CreatedAt,
            @session_date as UpdatedAt
        FROM [dbo].[StudentClasses] sc
        INNER JOIN [dbo].[TrainingClasses] tc ON sc.TrainingClassId = tc.Id
        INNER JOIN [dbo].[ClassSchedules] cs ON tc.Id = cs.TrainingClassId
        WHERE cs.Day = @day_of_week
        AND sc.Date = '2024-09-20'  -- Our template records
        AND ABS(CHECKSUM(NEWID()) % 4) = 0; -- Only 25% of classes have sessions on any given day
    END
    
    SET @session_date = DATEADD(DAY, 1, @session_date);
END

PRINT 'Additional class sessions created successfully!'

-- ==========================================
-- SUMMARY REPORT
-- ==========================================
PRINT ''
PRINT 'SUMMARY REPORT'
PRINT '=============='

SELECT 
    'Total Training Classes' as Metric,
    COUNT(*) as Count
FROM [dbo].[TrainingClasses]
WHERE Name NOT LIKE '%Test%'

UNION ALL

SELECT 
    'Total Class Schedules' as Metric,
    COUNT(*) as Count
FROM [dbo].[ClassSchedules] cs
INNER JOIN [dbo].[TrainingClasses] tc ON cs.TrainingClassId = tc.Id
WHERE tc.Name NOT LIKE '%Test%'

UNION ALL

SELECT 
    'Total Student-Class Assignments' as Metric,
    COUNT(*) as Count
FROM [dbo].[StudentClasses] sc
INNER JOIN [dbo].[TrainingClasses] tc ON sc.TrainingClassId = tc.Id
WHERE tc.Name NOT LIKE '%Test%'

UNION ALL

SELECT 
    'Average Attendance Rate' as Metric,
    CAST(AVG(CAST([Attended] AS FLOAT)) * 100 AS INT) as Count
FROM [dbo].[StudentClasses] sc
INNER JOIN [dbo].[TrainingClasses] tc ON sc.TrainingClassId = tc.Id
WHERE tc.Name NOT LIKE '%Test%';

-- Detailed breakdown by dojang
PRINT ''
PRINT 'CLASSES BY DOJANG'
PRINT '=================='

SELECT 
    d.Name as DojaangName,
    tc.Name as ClassName,
    COUNT(DISTINCT s.StudentId) as TotalStudents,
    CONCAT(
        STRING_AGG(
            CONCAT(
                CASE cs.Day 
                    WHEN 1 THEN 'Lun'
                    WHEN 2 THEN 'Mar' 
                    WHEN 3 THEN 'Mié'
                    WHEN 4 THEN 'Jue'
                    WHEN 5 THEN 'Vie'
                    WHEN 6 THEN 'Sáb'
                    WHEN 7 THEN 'Dom'
                END,
                ' ', 
                FORMAT(cs.StartTime, 'HH:mm'),
                '-',
                FORMAT(cs.EndTime, 'HH:mm')
            ), 
            ', '
        )
    ) as Schedule
FROM [dbo].[Dojaangs] d
INNER JOIN [dbo].[TrainingClasses] tc ON d.Id = tc.DojaangId
LEFT JOIN [dbo].[StudentClasses] s ON tc.Id = s.TrainingClassId AND s.Date = '2024-09-20'
LEFT JOIN [dbo].[ClassSchedules] cs ON tc.Id = cs.TrainingClassId
WHERE d.Name NOT IN ('Dojang 1', 'Dojang 2')
GROUP BY d.Name, tc.Name, tc.Id
ORDER BY d.Name, tc.Name;

PRINT ''
PRINT 'Argentine Training Classes setup completed successfully!'
PRINT '======================================================'
