-- Quick Setup: Basic Training Classes with Schedules
-- This script creates basic training classes and schedules if none exist

USE [TKDHubDb]
GO

PRINT 'Quick Setup: Basic Training Classes with Schedules'
PRINT '================================================='

-- Check if we have any training classes
DECLARE @ClassCount INT = (SELECT COUNT(*) FROM [dbo].[TrainingClasses])
PRINT 'Current Training Classes count: ' + CAST(@ClassCount AS NVARCHAR)

-- If no classes exist, create basic ones
IF @ClassCount = 0
BEGIN
    PRINT 'No training classes found. Creating basic classes...'
    
    -- Get the first active dojang and coach
    DECLARE @FirstDojaangId INT = (SELECT TOP 1 Id FROM [dbo].[Dojaangs] WHERE IsActive = 1 ORDER BY Id)
    DECLARE @FirstCoachId INT = (SELECT TOP 1 Id FROM [dbo].[Users] WHERE Id IN (
        SELECT UserId FROM [dbo].[UserUserRoles] uur 
        INNER JOIN [dbo].[UserRoles] ur ON uur.UserRoleId = ur.Id 
        WHERE ur.Name = 'Coach'
    ) ORDER BY Id)
    
    PRINT 'Using Dojang ID: ' + CAST(@FirstDojaangId AS NVARCHAR) + ', Coach ID: ' + CAST(@FirstCoachId AS NVARCHAR)
    
    -- Create basic training classes
    INSERT INTO [dbo].[TrainingClasses] ([Name], [Description], [Capacity], [DojaangId], [CoachId], [CreatedAt], [UpdatedAt])
    VALUES 
    ('Kids Class (6-9 years)', 'Beginner class for children ages 6-9', 15, @FirstDojaangId, @FirstCoachId, GETDATE(), GETDATE()),
    ('Youth Class (10-14 years)', 'Intermediate class for youth ages 10-14', 20, @FirstDojaangId, @FirstCoachId, GETDATE(), GETDATE()),
    ('Teen Class (15-17 years)', 'Advanced class for teenagers', 15, @FirstDojaangId, @FirstCoachId, GETDATE(), GETDATE()),
    ('Adult Beginner', 'Beginner class for adults 18+', 25, @FirstDojaangId, @FirstCoachId, GETDATE(), GETDATE()),
    ('Adult Advanced', 'Advanced class for experienced adults', 20, @FirstDojaangId, @FirstCoachId, GETDATE(), GETDATE())
    
    PRINT 'Basic training classes created!'
END
ELSE
BEGIN
    PRINT 'Training classes already exist.'
END

-- Now add schedules to any classes that don't have them
PRINT 'Adding schedules to classes without them...'

-- Get classes without schedules
DECLARE @ClassesWithoutSchedules TABLE (
    ClassId INT,
    ClassName NVARCHAR(255)
)

INSERT INTO @ClassesWithoutSchedules
SELECT tc.Id, tc.Name
FROM [dbo].[TrainingClasses] tc
WHERE tc.Id NOT IN (
    SELECT DISTINCT TrainingClassId 
    FROM [dbo].[ClassSchedules]
    WHERE TrainingClassId IS NOT NULL
)

DECLARE @ScheduleClassCount INT = (SELECT COUNT(*) FROM @ClassesWithoutSchedules)
PRINT 'Classes without schedules: ' + CAST(@ScheduleClassCount AS NVARCHAR)

-- Add schedules for each class without them
INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
SELECT 
    tc.Id,
    CASE 
        WHEN tc.Name LIKE '%Kid%' THEN 1  -- Monday
        WHEN tc.Name LIKE '%Youth%' THEN 2  -- Tuesday  
        WHEN tc.Name LIKE '%Teen%' THEN 3   -- Wednesday
        WHEN tc.Name LIKE '%Beginner%' THEN 4  -- Thursday
        ELSE 5  -- Friday
    END as Day,
    CASE 
        WHEN tc.Name LIKE '%Kid%' THEN '16:00:00'
        WHEN tc.Name LIKE '%Youth%' THEN '17:00:00'
        WHEN tc.Name LIKE '%Teen%' THEN '18:00:00'
        WHEN tc.Name LIKE '%Beginner%' THEN '19:00:00'
        ELSE '20:00:00'
    END as StartTime,
    CASE 
        WHEN tc.Name LIKE '%Kid%' THEN '17:00:00'
        WHEN tc.Name LIKE '%Youth%' THEN '18:30:00'
        WHEN tc.Name LIKE '%Teen%' THEN '19:30:00'
        WHEN tc.Name LIKE '%Beginner%' THEN '20:30:00'
        ELSE '21:30:00'
    END as EndTime,
    GETDATE(),
    GETDATE()
FROM [dbo].[TrainingClasses] tc
INNER JOIN @ClassesWithoutSchedules cwos ON tc.Id = cwos.ClassId

-- Add a second schedule day for each class
INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
SELECT 
    tc.Id,
    CASE 
        WHEN tc.Name LIKE '%Kid%' THEN 3  -- Wednesday
        WHEN tc.Name LIKE '%Youth%' THEN 4  -- Thursday
        WHEN tc.Name LIKE '%Teen%' THEN 5   -- Friday
        WHEN tc.Name LIKE '%Beginner%' THEN 6  -- Saturday
        ELSE 1  -- Monday
    END as Day,
    CASE 
        WHEN tc.Name LIKE '%Kid%' THEN '16:00:00'
        WHEN tc.Name LIKE '%Youth%' THEN '17:00:00'
        WHEN tc.Name LIKE '%Teen%' THEN '18:00:00'
        WHEN tc.Name LIKE '%Beginner%' THEN '10:00:00'  -- Saturday morning
        ELSE '20:00:00'
    END as StartTime,
    CASE 
        WHEN tc.Name LIKE '%Kid%' THEN '17:00:00'
        WHEN tc.Name LIKE '%Youth%' THEN '18:30:00'
        WHEN tc.Name LIKE '%Teen%' THEN '19:30:00'
        WHEN tc.Name LIKE '%Beginner%' THEN '11:30:00'  -- Saturday morning
        ELSE '21:30:00'
    END as EndTime,
    GETDATE(),
    GETDATE()
FROM [dbo].[TrainingClasses] tc
INNER JOIN @ClassesWithoutSchedules cwos ON tc.Id = cwos.ClassId

PRINT 'Schedules added successfully!'

-- Show final results
PRINT ''
PRINT '=== FINAL RESULTS ==='
PRINT 'Training Classes with Schedules:'

SELECT 
    tc.Id,
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
LEFT JOIN [dbo].[ClassSchedules] cs ON tc.Id = cs.TrainingClassId
ORDER BY tc.Id, cs.Day

PRINT ''
PRINT 'Setup completed successfully!'
