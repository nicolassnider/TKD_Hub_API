-- Add Class Schedules to Existing Training Classes
-- This script adds schedules to training classes that don't have any

USE [TKDHubDb]
GO

PRINT 'Adding Class Schedules to Existing Training Classes...'
PRINT '===================================================='

-- First, let's see what classes exist without schedules
PRINT 'Classes without schedules:'
SELECT tc.Id, tc.Name, d.Name as DojaangName
FROM [dbo].[TrainingClasses] tc
INNER JOIN [dbo].[Dojaangs] d ON tc.DojaangId = d.Id
WHERE tc.Id NOT IN (
    SELECT DISTINCT TrainingClassId 
    FROM [dbo].[ClassSchedules]
    WHERE TrainingClassId IS NOT NULL
)

-- Add schedules for classes that don't have any
DECLARE @class_cursor CURSOR;
DECLARE @class_id INT;
DECLARE @class_name NVARCHAR(255);
DECLARE @dojang_id INT;

SET @class_cursor = CURSOR FOR
SELECT tc.Id, tc.Name, tc.DojaangId
FROM [dbo].[TrainingClasses] tc
WHERE tc.Id NOT IN (
    SELECT DISTINCT TrainingClassId 
    FROM [dbo].[ClassSchedules]
    WHERE TrainingClassId IS NOT NULL
)
ORDER BY tc.DojaangId, tc.Name;

OPEN @class_cursor;
FETCH NEXT FROM @class_cursor INTO @class_id, @class_name, @dojang_id;

WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT 'Adding schedule for class: ' + @class_name + ' (ID: ' + CAST(@class_id AS NVARCHAR) + ')'

    -- Assign different schedule patterns based on class type or default pattern
    IF @class_name LIKE '%Infantiles%' OR @class_name LIKE '%Kids%' OR @class_name LIKE '%6%' OR @class_name LIKE '%Children%'
    BEGIN
        -- Monday and Wednesday 16:00-17:00
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 1, '16:00:00', '17:00:00', GETDATE(), GETDATE()),  -- Monday
        (@class_id, 3, '16:00:00', '17:00:00', GETDATE(), GETDATE());  -- Wednesday
    END
    ELSE IF @class_name LIKE '%Juveniles%' OR @class_name LIKE '%Teen%' OR @class_name LIKE '%10%'
    BEGIN
        -- Tuesday and Thursday 17:00-18:30
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 2, '17:00:00', '18:30:00', GETDATE(), GETDATE()),  -- Tuesday
        (@class_id, 4, '17:00:00', '18:30:00', GETDATE(), GETDATE());  -- Thursday
    END
    ELSE IF @class_name LIKE '%Adolescentes%' OR @class_name LIKE '%15%'
    BEGIN
        -- Monday and Friday 18:30-20:00
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 1, '18:30:00', '20:00:00', GETDATE(), GETDATE()),  -- Monday
        (@class_id, 5, '18:30:00', '20:00:00', GETDATE(), GETDATE());  -- Friday
    END
    ELSE IF @class_name LIKE '%Adult%' OR @class_name LIKE '%Adultos%'
    BEGIN
        -- Tuesday and Thursday 19:00-20:30
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 2, '19:00:00', '20:30:00', GETDATE(), GETDATE()),  -- Tuesday
        (@class_id, 4, '19:00:00', '20:30:00', GETDATE(), GETDATE());  -- Thursday
    END
    ELSE
    BEGIN
        -- Default schedule: Monday, Wednesday, Friday 18:00-19:30
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 1, '18:00:00', '19:30:00', GETDATE(), GETDATE()),  -- Monday
        (@class_id, 3, '18:00:00', '19:30:00', GETDATE(), GETDATE()),  -- Wednesday
        (@class_id, 5, '18:00:00', '19:30:00', GETDATE(), GETDATE());  -- Friday
    END

    FETCH NEXT FROM @class_cursor INTO @class_id, @class_name, @dojang_id;
END

CLOSE @class_cursor;
DEALLOCATE @class_cursor;

-- Show results
PRINT 'Schedule creation completed!'
PRINT ''
PRINT 'Summary of all classes with schedules:'
SELECT 
    tc.Id,
    tc.Name as ClassName,
    d.Name as DojaangName,
    COUNT(cs.Id) as ScheduleCount
FROM [dbo].[TrainingClasses] tc
INNER JOIN [dbo].[Dojaangs] d ON tc.DojaangId = d.Id
LEFT JOIN [dbo].[ClassSchedules] cs ON tc.Id = cs.TrainingClassId
GROUP BY tc.Id, tc.Name, d.Name
ORDER BY d.Name, tc.Name

PRINT ''
PRINT 'Detailed schedule view:'
SELECT 
    tc.Name as ClassName,
    d.Name as DojaangName,
    CASE cs.Day 
        WHEN 0 THEN 'Sunday'
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
    END as DayOfWeek,
    FORMAT(CAST(cs.StartTime AS DATETIME), 'HH:mm') as StartTime,
    FORMAT(CAST(cs.EndTime AS DATETIME), 'HH:mm') as EndTime
FROM [dbo].[TrainingClasses] tc
INNER JOIN [dbo].[Dojaangs] d ON tc.DojaangId = d.Id
INNER JOIN [dbo].[ClassSchedules] cs ON tc.Id = cs.TrainingClassId
ORDER BY d.Name, tc.Name, cs.Day, cs.StartTime

PRINT 'Class schedules added successfully!'
