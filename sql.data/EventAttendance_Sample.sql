-- Event Attendance Sample Data
-- This file creates comprehensive attendance records for events
-- Includes realistic attendance patterns and status tracking

USE [TKDHubDb]
GO

PRINT 'Inserting event attendance sample data...';

-- Get event IDs
DECLARE @Event1 INT = (SELECT TOP 1 Id FROM Events WHERE Type = 0 ORDER BY StartDate); -- Belt test
DECLARE @Event2 INT = (SELECT TOP 1 Id FROM Events WHERE Type = 1 ORDER BY StartDate); -- Tournament  
DECLARE @Event3 INT = (SELECT TOP 1 Id FROM Events WHERE Type = 2 ORDER BY StartDate); -- Seminar

-- Get student IDs for attendance
DECLARE @Students TABLE (UserId INT, RankId INT);
INSERT INTO @Students
SELECT TOP 15 u.Id, u.CurrentRankId
FROM Users u 
INNER JOIN UserUserRoles uur ON u.Id = uur.UserId 
WHERE uur.UserRoleId = 3 -- Students only
ORDER BY u.Id;

-- Insert attendance records for Belt Testing Event
IF @Event1 IS NOT NULL
BEGIN
    PRINT 'Adding attendance for Belt Testing Event...';
    
    INSERT INTO [dbo].[EventAttendances] ([EventId], [StudentId], [AttendanceDate], [AttendanceTime], [Status], [CreatedAt], [UpdatedAt])
    SELECT 
        @Event1,
        s.UserId,
        DATEADD(day, 0, (SELECT StartDate FROM Events WHERE Id = @Event1)),
        CASE 
            WHEN s.UserId % 3 = 0 THEN '14:30:00'  -- Some arrive on time
            WHEN s.UserId % 3 = 1 THEN '14:25:00'  -- Some arrive early  
            ELSE '14:35:00'                        -- Some arrive late
        END,
        CASE 
            WHEN s.UserId % 5 = 0 THEN 'Absent'    -- 20% absent
            WHEN s.UserId % 4 = 0 THEN 'Late'      -- Some late arrivals
            ELSE 'Present'                         -- Majority present
        END,
        GETDATE(),
        GETDATE()
    FROM @Students s
    WHERE s.RankId BETWEEN 3 AND 9; -- Only color belt students for belt test
    
    PRINT 'Belt testing attendance records created';
END

-- Insert attendance records for Tournament Event  
IF @Event2 IS NOT NULL
BEGIN
    PRINT 'Adding attendance for Tournament Event...';
    
    INSERT INTO [dbo].[EventAttendances] ([EventId], [StudentId], [AttendanceDate], [AttendanceTime], [Status], [CreatedAt], [UpdatedAt])
    SELECT 
        @Event2,
        s.UserId,
        DATEADD(day, 0, (SELECT StartDate FROM Events WHERE Id = @Event2)),
        CASE 
            WHEN s.UserId % 4 = 0 THEN '09:00:00'  -- Early competitors
            WHEN s.UserId % 4 = 1 THEN '10:30:00'  -- Mid-morning arrival
            WHEN s.UserId % 4 = 2 THEN '13:15:00'  -- Afternoon session
            ELSE '15:45:00'                        -- Late session observers
        END,
        CASE 
            WHEN s.UserId % 7 = 0 THEN 'Absent'    -- ~14% absent (tournament day)
            WHEN s.UserId % 3 = 0 THEN 'Late'      -- Some late due to other divisions
            ELSE 'Present'                         -- Most present for tournament
        END,
        GETDATE(),
        GETDATE()
    FROM @Students s
    WHERE s.RankId >= 6; -- Higher ranks typically compete in tournaments
    
    PRINT 'Tournament attendance records created';
END

-- Insert attendance records for Seminar Event
IF @Event3 IS NOT NULL  
BEGIN
    PRINT 'Adding attendance for Seminar Event...';
    
    INSERT INTO [dbo].[EventAttendances] ([EventId], [StudentId], [AttendanceDate], [AttendanceTime], [Status], [CreatedAt], [UpdatedAt])
    SELECT 
        @Event3,
        s.UserId,
        DATEADD(day, 0, (SELECT StartDate FROM Events WHERE Id = @Event3)),
        CASE 
            WHEN s.UserId % 2 = 0 THEN '11:00:00'  -- On-time arrival
            ELSE '11:10:00'                        -- Slightly late
        END,
        CASE 
            WHEN s.UserId % 6 = 0 THEN 'Absent'    -- ~17% absent (optional seminar)
            WHEN s.UserId % 8 = 0 THEN 'Late'      -- Some late arrivals
            ELSE 'Present'                         -- Good attendance for learning
        END,
        GETDATE(),
        GETDATE()
    FROM @Students s; -- All ranks can attend seminars
    
    PRINT 'Seminar attendance records created';
END

-- Add some additional events and attendance for more comprehensive data
PRINT 'Creating additional events for more attendance data...';

-- Insert a few more events
INSERT INTO [dbo].[Events] ([Name], [Description], [Type], [StartDate], [EndDate], [Location], [CoachId], [DojaangId])
VALUES 
('Examen de Grado Mensual', 'Monthly belt testing for eligible students across all levels', 0, DATEADD(day, 30, GETDATE()), DATEADD(day, 30, GETDATE()), 'Centro Kim Taekwondo - Sala Principal', 
 (SELECT TOP 1 u.Id FROM Users u INNER JOIN UserUserRoles uur ON u.Id = uur.UserId WHERE uur.UserRoleId = 2), 1),

('Demostración Escolar', 'School demonstration to promote Taekwondo among youth', 2, DATEADD(day, 45, GETDATE()), DATEADD(day, 45, GETDATE()), 'Escuela Primaria San Martín', 
 (SELECT TOP 1 u.Id FROM Users u INNER JOIN UserUserRoles uur ON u.Id = uur.UserId WHERE uur.UserRoleId = 2), 1),

('Entrenamiento Especial de Combate', 'Special sparring training session for advanced students', 2, DATEADD(day, 15, GETDATE()), DATEADD(day, 15, GETDATE()), 'Dragón Azul Academia - Dojang Principal',
 (SELECT u.Id FROM Users u INNER JOIN UserUserRoles uur ON u.Id = uur.UserId WHERE uur.UserRoleId = 2 ORDER BY u.Id OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY), 2);

-- Get the new event IDs
DECLARE @NewEvent1 INT = (SELECT Id FROM Events WHERE Name = 'Examen de Grado Mensual');
DECLARE @NewEvent2 INT = (SELECT Id FROM Events WHERE Name = 'Demostración Escolar'); 
DECLARE @NewEvent3 INT = (SELECT Id FROM Events WHERE Name = 'Entrenamiento Especial de Combate');

-- Add attendance for monthly belt test
IF @NewEvent1 IS NOT NULL
BEGIN
    INSERT INTO [dbo].[EventAttendances] ([EventId], [StudentId], [AttendanceDate], [AttendanceTime], [Status], [CreatedAt], [UpdatedAt])
    SELECT 
        @NewEvent1,
        s.UserId,
        DATEADD(day, 30, CAST(GETDATE() AS DATE)),
        '18:00:00',
        CASE 
            WHEN s.UserId % 4 = 0 THEN 'Absent'    -- 25% absent (monthly test)
            WHEN s.UserId % 6 = 0 THEN 'Late'      -- Some late arrivals
            ELSE 'Present'                         -- Most attend monthly tests
        END,
        GETDATE(),
        GETDATE()
    FROM @Students s
    WHERE s.RankId BETWEEN 1 AND 8; -- Gup ranks for monthly testing
END

-- Add attendance for school demonstration
IF @NewEvent2 IS NOT NULL
BEGIN
    INSERT INTO [dbo].[EventAttendances] ([EventId], [StudentId], [AttendanceDate], [AttendanceTime], [Status], [CreatedAt], [UpdatedAt])
    SELECT 
        @NewEvent2,
        s.UserId,
        DATEADD(day, 45, CAST(GETDATE() AS DATE)),
        '15:30:00',
        CASE 
            WHEN s.UserId % 3 = 0 THEN 'Absent'    -- 33% absent (school demo - voluntary)
            ELSE 'Present'                         -- Good turnout for demonstration
        END,
        GETDATE(),
        GETDATE()
    FROM @Students s
    WHERE s.RankId >= 4; -- Green belt and above for demonstrations
END

-- Display attendance summary
PRINT 'Event attendance summary:';
SELECT 
    e.Name as EventName,
    CASE e.Type 
        WHEN 0 THEN 'Belt Test'
        WHEN 1 THEN 'Tournament'
        WHEN 2 THEN 'Seminar'
        WHEN 3 THEN 'Demonstration'
        ELSE 'Other'
    END as EventType,
    e.StartDate,
    COUNT(ea.Id) as TotalAttendees,
    SUM(CASE WHEN ea.Status = 'Present' THEN 1 ELSE 0 END) as PresentCount,
    SUM(CASE WHEN ea.Status = 'Late' THEN 1 ELSE 0 END) as LateCount,
    SUM(CASE WHEN ea.Status = 'Absent' THEN 1 ELSE 0 END) as AbsentCount,
    ROUND(
        (CAST(SUM(CASE WHEN ea.Status = 'Present' THEN 1 ELSE 0 END) AS FLOAT) / 
         NULLIF(COUNT(ea.Id), 0)) * 100, 1
    ) as AttendanceRate
FROM [dbo].[Events] e
LEFT JOIN [dbo].[EventAttendances] ea ON e.Id = ea.EventId
GROUP BY e.Id, e.Name, e.Type, e.StartDate
ORDER BY e.StartDate;

PRINT 'Event attendance data insertion completed successfully.';

GO
