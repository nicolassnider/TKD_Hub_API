-- Tournaments and Tournament Management Sample Data
-- This file creates sample tournaments, matches, and registrations
-- Includes different tournament types and realistic competition structures

USE [TKDHubDb]
GO

PRINT 'Inserting tournament sample data...';

-- Insert sample tournaments
INSERT INTO [dbo].[Tournaments] ([Name], [Description], [Type], [StartDate], [EndDate], [Location], [DojaangId])
VALUES
-- Annual Championships
('Campeonato Nacional Argentino ITF 2024', 'Annual National ITF Taekwondo Championship featuring competitors from across Argentina', 0, '2024-11-15 09:00:00', '2024-11-17 18:00:00', 'Estadio Luna Park, Buenos Aires', 1),

('Copa Buenos Aires Regional', 'Regional tournament for Buenos Aires metropolitan area dojangs with youth and adult divisions', 1, '2024-10-20 08:00:00', '2024-10-20 20:00:00', 'Polideportivo San Martín, CABA', 1),

('Torneo Interclubes del Sur', 'Inter-club tournament featuring multiple dojangs from southern Buenos Aires province', 1, '2024-12-07 10:00:00', '2024-12-08 17:00:00', 'Centro Deportivo Municipal, La Plata', 2),

-- Technical Competitions
('Campeonato de Tuls Tradicionales', 'Traditional forms competition focusing on technical excellence and traditional patterns', 2, '2025-01-25 09:00:00', '2025-01-25 16:00:00', 'Dojang Central, Centro Kim Taekwondo', 1),

('Copa Técnica Juvenil', 'Youth technical competition for competitors under 18 years old', 2, '2024-11-30 14:00:00', '2024-11-30 18:00:00', 'Gimnasio Municipal de Córdoba', 3),

-- Local Tournaments
('Torneo de Primavera', 'Spring tournament for local dojangs with emphasis on participation and learning', 3, '2024-10-12 09:00:00', '2024-10-12 15:00:00', 'Dragón Azul Academia', 2),

('Copa de Verano', 'Summer championship series with multiple age divisions and skill levels', 3, '2025-02-15 08:00:00', '2025-02-16 17:00:00', 'Halcón del Sur Taekwondo', 4);

PRINT 'Tournaments inserted successfully.';

-- Get tournament and user IDs for registrations and matches
DECLARE @Tournament1 INT = (SELECT Id FROM Tournaments WHERE Name = 'Campeonato Nacional Argentino ITF 2024');
DECLARE @Tournament2 INT = (SELECT Id FROM Tournaments WHERE Name = 'Copa Buenos Aires Regional');
DECLARE @Tournament3 INT = (SELECT Id FROM Tournaments WHERE Name = 'Torneo Interclubes del Sur');
DECLARE @Tournament4 INT = (SELECT Id FROM Tournaments WHERE Name = 'Campeonato de Tuls Tradicionales');

-- Get some student IDs for registrations
DECLARE @Student1 INT = (SELECT TOP 1 u.Id FROM Users u INNER JOIN UserUserRoles uur ON u.Id = uur.UserId WHERE uur.UserRoleId = 3 AND u.CurrentRankId >= 7 ORDER BY u.Id);
DECLARE @Student2 INT = (SELECT u.Id FROM Users u INNER JOIN UserUserRoles uur ON u.Id = uur.UserId WHERE uur.UserRoleId = 3 AND u.CurrentRankId >= 8 AND u.Id != @Student1 ORDER BY u.Id OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY);
DECLARE @Student3 INT = (SELECT u.Id FROM Users u INNER JOIN UserUserRoles uur ON u.Id = uur.UserId WHERE uur.UserRoleId = 3 AND u.CurrentRankId >= 6 AND u.Id NOT IN (@Student1, @Student2) ORDER BY u.Id OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY);
DECLARE @Student4 INT = (SELECT u.Id FROM Users u INNER JOIN UserUserRoles uur ON u.Id = uur.UserId WHERE uur.UserRoleId = 3 AND u.CurrentRankId >= 5 AND u.Id NOT IN (@Student1, @Student2, @Student3) ORDER BY u.Id OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY);
DECLARE @Student5 INT = (SELECT u.Id FROM Users u INNER JOIN UserUserRoles uur ON u.Id = uur.UserId WHERE uur.UserRoleId = 3 AND u.CurrentRankId >= 9 AND u.Id NOT IN (@Student1, @Student2, @Student3, @Student4) ORDER BY u.Id OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY);
DECLARE @Student6 INT = (SELECT u.Id FROM Users u INNER JOIN UserUserRoles uur ON u.Id = uur.UserId WHERE uur.UserRoleId = 3 AND u.CurrentRankId >= 4 AND u.Id NOT IN (@Student1, @Student2, @Student3, @Student4, @Student5) ORDER BY u.Id OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY);

-- Insert tournament registrations
PRINT 'Adding tournament registrations...';

IF @Tournament1 IS NOT NULL
BEGIN
    INSERT INTO [dbo].[TournamentRegistrations] ([TournamentId], [UserId], [RegistrationDate], [Category], [Status])
    VALUES 
    (@Tournament1, @Student1, '2024-10-01', 'Senior Male Black Belt', 'Confirmed'),
    (@Tournament1, @Student2, '2024-10-05', 'Senior Female Black Belt', 'Confirmed'),
    (@Tournament1, @Student3, '2024-10-03', 'Junior Male Color Belt', 'Confirmed'),
    (@Tournament1, @Student4, '2024-10-07', 'Junior Female Color Belt', 'Confirmed'),
    (@Tournament1, @Student5, '2024-10-02', 'Senior Male Black Belt', 'Confirmed');
    
    PRINT 'Added registrations for National Championship';
END

IF @Tournament2 IS NOT NULL
BEGIN
    INSERT INTO [dbo].[TournamentRegistrations] ([TournamentId], [UserId], [RegistrationDate], [Category], [Status])
    VALUES 
    (@Tournament2, @Student3, '2024-09-20', 'Youth Color Belt', 'Confirmed'),
    (@Tournament2, @Student4, '2024-09-22', 'Youth Color Belt', 'Confirmed'),
    (@Tournament2, @Student6, '2024-09-25', 'Cadet Color Belt', 'Confirmed');
    
    PRINT 'Added registrations for Regional Cup';
END

IF @Tournament4 IS NOT NULL
BEGIN
    INSERT INTO [dbo].[TournamentRegistrations] ([TournamentId], [UserId], [RegistrationDate], [Category], [Status])
    VALUES 
    (@Tournament4, @Student1, '2024-12-15', 'Dan Tul Division', 'Confirmed'),
    (@Tournament4, @Student5, '2024-12-16', 'Dan Tul Division', 'Confirmed'),
    (@Tournament4, @Student3, '2024-12-18', 'Gup Tul Division', 'Confirmed');
    
    PRINT 'Added registrations for Tul Championship';
END

-- Insert sample matches
PRINT 'Creating tournament matches...';

IF @Tournament1 IS NOT NULL AND @Student1 IS NOT NULL AND @Student5 IS NOT NULL
BEGIN
    INSERT INTO [dbo].[Matches] ([TournamentId], [Competitor1Id], [Competitor2Id], [Round], [Category], [ScheduledTime], [Result], [Score1], [Score2], [Status])
    VALUES 
    (@Tournament1, @Student1, @Student5, 'Semi-Final', 'Senior Male Black Belt', '2024-11-16 14:30:00', 'Competitor1Won', 12, 8, 'Completed'),
    (@Tournament1, @Student3, @Student4, 'Quarter-Final', 'Junior Color Belt', '2024-11-16 10:15:00', 'Competitor2Won', 6, 9, 'Completed');
    
    PRINT 'Added matches for National Championship';
END

IF @Tournament2 IS NOT NULL AND @Student3 IS NOT NULL AND @Student4 IS NOT NULL
BEGIN
    INSERT INTO [dbo].[Matches] ([TournamentId], [Competitor1Id], [Competitor2Id], [Round], [Category], [ScheduledTime], [Result], [Score1], [Score2], [Status])
    VALUES 
    (@Tournament2, @Student3, @Student4, 'Final', 'Youth Color Belt', '2024-10-20 16:00:00', 'Competitor1Won', 11, 7, 'Completed'),
    (@Tournament2, @Student6, @Student3, 'Semi-Final', 'Youth Color Belt', '2024-10-20 14:30:00', 'Competitor2Won', 5, 8, 'Completed');
    
    PRINT 'Added matches for Regional Cup';
END

-- Display tournament summary
PRINT 'Tournament summary:';
SELECT 
    t.Name as TournamentName,
    CASE t.Type 
        WHEN 0 THEN 'Championship'
        WHEN 1 THEN 'Regional'
        WHEN 2 THEN 'Technical'
        WHEN 3 THEN 'Local'
        ELSE 'Other'
    END as TournamentType,
    t.StartDate,
    t.Location,
    (SELECT COUNT(*) FROM TournamentRegistrations tr WHERE tr.TournamentId = t.Id) as Registrations,
    (SELECT COUNT(*) FROM Matches m WHERE m.TournamentId = t.Id) as Matches
FROM [dbo].[Tournaments] t
ORDER BY t.StartDate;

-- Display registrations summary
PRINT 'Registration summary:';
SELECT 
    t.Name as Tournament,
    u.FirstName + ' ' + u.LastName as Competitor,
    tr.Category,
    tr.Status,
    tr.RegistrationDate
FROM [dbo].[TournamentRegistrations] tr
INNER JOIN [dbo].[Tournaments] t ON tr.TournamentId = t.Id
INNER JOIN [dbo].[Users] u ON tr.UserId = u.Id
ORDER BY t.StartDate, tr.RegistrationDate;

GO
