-- Master Script for Argentine TKD Hub Sample Data
-- This script executes all Argentine sample data in the correct order
-- Execute this script to populate the database with realistic Argentine data

USE [TKDHubDb]
GO

PRINT 'Starting Argentine TKD Hub sample data insertion...'
PRINT '=================================================='

-- Check if we have the necessary base data (UserRoles, Ranks)
IF NOT EXISTS (SELECT 1 FROM [dbo].[UserRoles] WHERE Id = 2)
BEGIN
    PRINT 'ERROR: UserRoles table must be populated first with role ID 2 (Coach)'
    RETURN
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[UserRoles] WHERE Id = 3)
BEGIN
    PRINT 'ERROR: UserRoles table must be populated first with role ID 3 (Student)'
    RETURN
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[Ranks] WHERE Id BETWEEN 1 AND 20)
BEGIN
    PRINT 'ERROR: Ranks table must be populated first with ranks 1-20'
    RETURN
END

PRINT 'Base data validation passed. Proceeding with data insertion...'
PRINT ''

-- ==========================================
-- STEP 1: Insert Argentine Coaches
-- ==========================================
PRINT 'STEP 1: Inserting Argentine Coaches...'

-- Insert coaches with Argentine names and details
INSERT INTO [dbo].[Users] ([FirstName], [LastName], [Email], [PasswordHash], [DateOfBirth], [Gender], [PhoneNumber], [DojaangId], [CurrentRankId], [JoinDate], [IsActive], [CreatedAt], [UpdatedAt])
VALUES
-- Master instructors (Dan ranks 4-6)
('Carlos', 'Fernández Almeyda', 'carlos.fernandez@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1978-03-15', 'MALE', '+54 11 4567-8901', NULL, 19, '2010-01-15', 1, '2010-01-15', '2024-09-20'),
('María', 'Rodríguez Paz', 'maria.rodriguez@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1980-11-22', 'FEMALE', '+54 11 4567-8902', NULL, 18, '2012-03-10', 1, '2012-03-10', '2024-09-20'),
('Jorge', 'Morales Vega', 'jorge.morales@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1975-07-08', 'MALE', '+54 11 4567-8903', NULL, 20, '2008-05-20', 1, '2008-05-20', '2024-09-20'),
('Silvia', 'Delgado Herrera', 'silvia.delgado@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1982-12-03', 'FEMALE', '+54 11 4567-8904', NULL, 17, '2014-02-28', 1, '2014-02-28', '2024-09-20'),
-- Senior instructors (Dan ranks 2-3)
('Alejandro', 'Gutiérrez Silva', 'alejandro.gutierrez@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1985-04-18', 'MALE', '+54 11 4567-8905', NULL, 16, '2016-08-12', 1, '2016-08-12', '2024-09-20'),
('Valeria', 'Martínez Córdoba', 'valeria.martinez@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1987-09-25', 'FEMALE', '+54 11 4567-8906', NULL, 15, '2018-01-08', 1, '2018-01-08', '2024-09-20'),
('Sebastián', 'López Ramírez', 'sebastian.lopez@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1983-06-12', 'MALE', '+54 11 4567-8907', NULL, 16, '2015-11-15', 1, '2015-11-15', '2024-09-20'),
('Florencia', 'González Méndez', 'florencia.gonzalez@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1989-01-30', 'FEMALE', '+54 11 4567-8908', NULL, 14, '2019-06-03', 1, '2019-06-03', '2024-09-20'),
-- Junior instructors (Dan rank 1)
('Martín', 'Sánchez Acosta', 'martin.sanchez@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1990-08-14', 'MALE', '+54 11 4567-8909', NULL, 13, '2020-04-22', 1, '2020-04-22', '2024-09-20'),
('Luciana', 'Torres Benítez', 'luciana.torres@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1992-02-28', 'FEMALE', '+54 11 4567-8910', NULL, 13, '2021-07-10', 1, '2021-07-10', '2024-09-20'),
('Nicolás', 'Vargas Castillo', 'nicolas.vargas@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1988-10-05', 'MALE', '+54 11 4567-8911', NULL, 13, '2019-12-18', 1, '2019-12-18', '2024-09-20'),
('Agustina', 'Peña Villalba', 'agustina.pena@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1991-05-17', 'FEMALE', '+54 11 4567-8912', NULL, 13, '2022-01-25', 1, '2022-01-25', '2024-09-20'),
-- Regional coaches from different provinces
('Eduardo', 'Moreno Quiroga', 'eduardo.moreno@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1979-12-10', 'MALE', '+54 351 456-7890', NULL, 17, '2011-09-05', 1, '2011-09-05', '2024-09-20'), -- Córdoba
('Patricia', 'Romero Ibarra', 'patricia.romero@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1984-08-23', 'FEMALE', '+54 261 456-7891', NULL, 15, '2017-03-14', 1, '2017-03-14', '2024-09-20'), -- Mendoza
('Gastón', 'Herrera Navarro', 'gaston.herrera@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1986-03-07', 'MALE', '+54 341 456-7892', NULL, 14, '2018-10-09', 1, '2018-10-09', '2024-09-20'), -- Rosario
('Yamila', 'Castro Medina', 'yamila.castro@tkdhub.com.ar', '$2a$11$dummy.hash.for.development', '1993-11-19', 'FEMALE', '+54 381 456-7893', NULL, 12, '2023-02-11', 1, '2023-02-11', '2024-09-20'); -- Tucumán

-- Assign coach roles
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId])
SELECT u.Id, 2 as UserRoleId
FROM [dbo].[Users] u
WHERE u.Email LIKE '%@tkdhub.com.ar'
AND NOT EXISTS (SELECT 1 FROM [dbo].[UserUserRoles] uur WHERE uur.UserId = u.Id AND uur.UserRoleId = 2);

PRINT 'Argentine coaches inserted successfully!'
PRINT CONCAT('Total coaches: ', @@ROWCOUNT)
PRINT ''

-- ==========================================
-- STEP 2: Insert Argentine Dojangs
-- ==========================================
PRINT 'STEP 2: Inserting Argentine Dojangs...'

INSERT INTO [dbo].[Dojaangs]
           ([Name], [Address], [Location], [PhoneNumber], [Email], [KoreanName], [KoreanNamePhonetic], [CoachId], [IsActive], [CreatedAt], [UpdatedAt])
VALUES
-- Buenos Aires Capital Federal
('Tigre Dorado Taekwondo', 'Av. Corrientes 1847', 'Buenos Aires, CABA, Balvanera', '+54 11 4372-8901', 'info@tigradorado.com.ar', N'황금호랑이', 'Hwanggeum Horangi', NULL, 1, '2015-03-15', '2024-09-20'),
('Dragón Azul Academia', 'Av. Santa Fe 2456', 'Buenos Aires, CABA, Recoleta', '+54 11 4801-2345', 'contacto@dragonazul.com.ar', N'푸른용', 'Pureun Yong', NULL, 1, '2012-08-20', '2024-09-20'),
('Halcón del Sur Dojang', 'Av. Rivadavia 7823', 'Buenos Aires, CABA, Flores', '+54 11 4635-9876', 'halcondelsur@tkd.com.ar', N'남쪽매', 'Namjjok Mae', NULL, 1, '2018-01-10', '2024-09-20'),
('Centro Kim Taekwondo', 'Av. Callao 1234', 'Buenos Aires, CABA, Once', '+54 11 4372-5555', 'info@kimtaekwondo.com.ar', N'김도장', 'Kim Dojang', NULL, 1, '2010-06-05', '2024-09-20'),
('Leones de Palermo', 'Av. Las Heras 3456', 'Buenos Aires, CABA, Palermo', '+54 11 4801-7777', 'leones@palermo-tkd.com.ar', N'팔레르모사자', 'Pallereumo Saja', NULL, 1, '2016-11-22', '2024-09-20'),
-- Buenos Aires Provincia
('Guerreros del Plata', 'Calle 7 entre 47 y 48', 'La Plata, Buenos Aires', '+54 221 425-8901', 'guerrerosplata@tkd.com.ar', N'강의전사', 'Gangui Jeonsa', NULL, 1, '2014-04-18', '2024-09-20'),
('Academia Tigre Norte', 'Av. Casuarinas 1890', 'Tigre, Buenos Aires', '+54 11 4749-3333', 'tigrenorte@academia.com.ar', N'북쪽호랑이', 'Bukjjok Horangi', NULL, 1, '2017-09-12', '2024-09-20'),
('Dragones de Quilmes', 'Hipólito Yrigoyen 567', 'Quilmes, Buenos Aires', '+54 11 4253-9999', 'dragones@quilmes-tkd.com.ar', N'킬메스용', 'Kilmeseu Yong', NULL, 1, '2019-02-28', '2024-09-20'),
-- Other provinces
('Montaña Sagrada Dojang', 'Av. Colón 1445', 'Córdoba Capital, Córdoba', '+54 351 423-7890', 'montanasagrada@cordoba-tkd.com.ar', N'성산', 'Seongsan', NULL, 1, '2013-07-15', '2024-09-20'),
('Escuela Aconcagua Taekwondo', 'San Martín 1234', 'Mendoza Capital, Mendoza', '+54 261 429-5678', 'aconcagua@mendoza-tkd.com.ar', N'아콘카과', 'Akonkagwa', NULL, 1, '2011-12-08', '2024-09-20'),
('Río Paraná Taekwondo', 'Córdoba 1567', 'Rosario, Santa Fe', '+54 341 424-7890', 'rioparana@rosario-tkd.com.ar', N'파라나강', 'Parana Gang', NULL, 1, '2015-01-20', '2024-09-20'),
('Jardín del Norte Academia', 'San Martín 567', 'San Miguel de Tucumán, Tucumán', '+54 381 422-3456', 'jardindelnorte@tucuman-tkd.com.ar', N'북방정원', 'Bukbang Jeongwon', NULL, 1, '2014-11-03', '2024-09-20');

-- Assign coaches to dojangs
DECLARE @coach_cursor CURSOR;
DECLARE @dojang_cursor CURSOR;
DECLARE @coach_id INT;
DECLARE @dojang_id INT;

SET @coach_cursor = CURSOR FOR
SELECT u.Id FROM [dbo].[Users] u
INNER JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId
WHERE uur.UserRoleId = 2 AND u.Email LIKE '%@tkdhub.com.ar'
ORDER BY u.CurrentRankId DESC, NEWID();

SET @dojang_cursor = CURSOR FOR
SELECT Id FROM [dbo].[Dojaangs] 
WHERE CoachId IS NULL AND Name NOT IN ('Dojang 1', 'Dojang 2')
ORDER BY Id;

OPEN @coach_cursor;
OPEN @dojang_cursor;

FETCH NEXT FROM @dojang_cursor INTO @dojang_id;
WHILE @@FETCH_STATUS = 0
BEGIN
    FETCH NEXT FROM @coach_cursor INTO @coach_id;
    IF @@FETCH_STATUS = 0
    BEGIN
        UPDATE [dbo].[Dojaangs] SET CoachId = @coach_id WHERE Id = @dojang_id;
    END
    ELSE
    BEGIN
        -- Reset cursor if we run out of coaches
        CLOSE @coach_cursor;
        OPEN @coach_cursor;
        FETCH NEXT FROM @coach_cursor INTO @coach_id;
        UPDATE [dbo].[Dojaangs] SET CoachId = @coach_id WHERE Id = @dojang_id;
    END
    
    FETCH NEXT FROM @dojang_cursor INTO @dojang_id;
END

CLOSE @coach_cursor;
CLOSE @dojang_cursor;
DEALLOCATE @coach_cursor;
DEALLOCATE @dojang_cursor;

PRINT 'Argentine dojangs inserted successfully!'
PRINT ''

-- ==========================================
-- STEP 3: Insert Argentine Students
-- ==========================================
PRINT 'STEP 3: Inserting Argentine Students...'

-- Get a sample of dojang IDs for student assignment
DECLARE @dojang_ids TABLE (Id INT);
INSERT INTO @dojang_ids SELECT TOP 5 Id FROM [dbo].[Dojaangs] WHERE Name NOT IN ('Dojang 1', 'Dojang 2') ORDER BY NEWID();

-- Insert students with Argentine names and details
INSERT INTO [dbo].[Users] ([FirstName], [LastName], [Email], [PasswordHash], [DateOfBirth], [Gender], [PhoneNumber], [DojaangId], [CurrentRankId], [JoinDate], [IsActive], [CreatedAt], [UpdatedAt])
VALUES
-- Children and teenagers (8-17 years old)
('Tomás', 'Acuña Morales', 'tomas.acuna@gmail.com', '$2a$11$dummy.hash.for.development', '2015-03-15', 'MALE', '+54 11 5678-9001', (SELECT TOP 1 Id FROM @dojang_ids ORDER BY NEWID()), 1, '2023-02-10', 1, '2023-02-10', '2024-09-20'),
('Valentina', 'Benitez Sosa', 'valentina.benitez@gmail.com', '$2a$11$dummy.hash.for.development', '2014-07-22', 'FEMALE', '+54 11 5678-9002', (SELECT TOP 1 Id FROM @dojang_ids ORDER BY NEWID()), 2, '2022-08-15', 1, '2022-08-15', '2024-09-20'),
('Benjamín', 'Cardozo Luna', 'benjamin.cardozo@gmail.com', '$2a$11$dummy.hash.for.development', '2016-11-08', 'MALE', '+54 11 5678-9003', (SELECT TOP 1 Id FROM @dojang_ids ORDER BY NEWID()), 1, '2024-01-20', 1, '2024-01-20', '2024-09-20'),
('Catalina', 'Díaz Peralta', 'catalina.diaz@gmail.com', '$2a$11$dummy.hash.for.development', '2013-04-12', 'FEMALE', '+54 11 5678-9004', (SELECT TOP 1 Id FROM @dojang_ids ORDER BY NEWID()), 4, '2021-06-05', 1, '2021-06-05', '2024-09-20'),
('Facundo', 'Espinoza Ramos', 'facundo.espinoza@gmail.com', '$2a$11$dummy.hash.for.development', '2015-09-30', 'MALE', '+54 11 5678-9005', (SELECT TOP 1 Id FROM @dojang_ids ORDER BY NEWID()), 2, '2023-04-12', 1, '2023-04-12', '2024-09-20'),
-- Young adults (18-25 years old)
('Santiago', 'Krauss Mendoza', 'santiago.krauss@gmail.com', '$2a$11$dummy.hash.for.development', '2004-01-18', 'MALE', '+54 11 5678-9011', (SELECT TOP 1 Id FROM @dojang_ids ORDER BY NEWID()), 7, '2020-09-10', 1, '2020-09-10', '2024-09-20'),
('Camila', 'Leguizamón Paz', 'camila.leguizamon@gmail.com', '$2a$11$dummy.hash.for.development', '2003-06-25', 'FEMALE', '+54 11 5678-9012', (SELECT TOP 1 Id FROM @dojang_ids ORDER BY NEWID()), 8, '2019-05-14', 1, '2019-05-14', '2024-09-20'),
('Maximiliano', 'Molina Quiroga', 'maximiliano.molina@gmail.com', '$2a$11$dummy.hash.for.development', '2005-11-12', 'MALE', '+54 11 5678-9013', (SELECT TOP 1 Id FROM @dojang_ids ORDER BY NEWID()), 6, '2021-02-20', 1, '2021-02-20', '2024-09-20'),
('Antonella', 'Navarro Rojas', 'antonella.navarro@gmail.com', '$2a$11$dummy.hash.for.development', '2002-04-07', 'FEMALE', '+54 11 5678-9014', (SELECT TOP 1 Id FROM @dojang_ids ORDER BY NEWID()), 9, '2018-08-30', 1, '2018-08-30', '2024-09-20'),
('Thiago', 'Ocampo Silva', 'thiago.ocampo@gmail.com', '$2a$11$dummy.hash.for.development', '2006-09-23', 'MALE', '+54 11 5678-9015', (SELECT TOP 1 Id FROM @dojang_ids ORDER BY NEWID()), 5, '2022-01-15', 1, '2022-01-15', '2024-09-20');

-- Assign student roles
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId])
SELECT u.Id, 3 as UserRoleId
FROM [dbo].[Users] u
WHERE u.Email LIKE '%@gmail.com'
AND NOT EXISTS (SELECT 1 FROM [dbo].[UserUserRoles] uur WHERE uur.UserId = u.Id AND uur.UserRoleId = 3);

PRINT 'Argentine students inserted successfully!'
PRINT ''

-- ==========================================
-- STEP 4: Insert Argentine Training Classes
-- ==========================================
PRINT 'STEP 4: Inserting Argentine Training Classes...'

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

-- Create class schedules
DECLARE @class_cursor CURSOR;
DECLARE @class_id INT;
DECLARE @class_name NVARCHAR(255);

SET @class_cursor = CURSOR FOR
SELECT tc.Id, tc.Name
FROM [dbo].[TrainingClasses] tc
WHERE tc.Name LIKE '%años%' OR tc.Name LIKE 'Adultos%'
ORDER BY tc.DojaangId, tc.Name;

OPEN @class_cursor;
FETCH NEXT FROM @class_cursor INTO @class_id, @class_name;

WHILE @@FETCH_STATUS = 0
BEGIN
    IF @class_name LIKE 'Infantiles%'
    BEGIN
        -- Monday and Wednesday 16:00-17:00
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 1, '16:00:00', '17:00:00', '2024-01-15', '2024-09-20'),
        (@class_id, 3, '16:00:00', '17:00:00', '2024-01-15', '2024-09-20');
    END
    ELSE IF @class_name LIKE 'Juveniles%'
    BEGIN
        -- Tuesday and Thursday 17:00-18:30
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 2, '17:00:00', '18:30:00', '2024-01-15', '2024-09-20'),
        (@class_id, 4, '17:00:00', '18:30:00', '2024-01-15', '2024-09-20');
    END
    ELSE IF @class_name LIKE 'Adultos Principiantes%'
    BEGIN
        -- Tuesday and Thursday 19:00-20:30
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 2, '19:00:00', '20:30:00', '2024-01-15', '2024-09-20'),
        (@class_id, 4, '19:00:00', '20:30:00', '2024-01-15', '2024-09-20');
    END
    ELSE IF @class_name LIKE 'Adultos Avanzados%'
    BEGIN
        -- Wednesday and Saturday
        INSERT INTO [dbo].[ClassSchedules] ([TrainingClassId], [Day], [StartTime], [EndTime], [CreatedAt], [UpdatedAt])
        VALUES 
        (@class_id, 3, '20:30:00', '22:00:00', '2024-01-15', '2024-09-20'),
        (@class_id, 6, '09:00:00', '10:30:00', '2024-01-15', '2024-09-20');
    END

    FETCH NEXT FROM @class_cursor INTO @class_id, @class_name;
END

CLOSE @class_cursor;
DEALLOCATE @class_cursor;

-- Assign students to appropriate classes based on age
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
WHERE s.Email LIKE '%@gmail.com'
AND (
    (YEAR(s.DateOfBirth) BETWEEN 2015 AND 2018 AND tc.Name = 'Infantiles (6-9 años)') OR
    (YEAR(s.DateOfBirth) BETWEEN 2010 AND 2014 AND tc.Name = 'Juveniles (10-14 años)') OR
    (YEAR(s.DateOfBirth) <= 2006 AND s.CurrentRankId BETWEEN 1 AND 6 AND tc.Name = 'Adultos Principiantes') OR
    (YEAR(s.DateOfBirth) <= 2006 AND s.CurrentRankId >= 7 AND tc.Name = 'Adultos Avanzados')
);

PRINT 'Argentine training classes created successfully!'
PRINT ''

-- ==========================================
-- SUMMARY REPORT
-- ==========================================
PRINT 'SUMMARY REPORT'
PRINT '=============='

SELECT 'Total Argentine Coaches' as Metric, COUNT(*) as Count
FROM [dbo].[Users] u
INNER JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId
WHERE uur.UserRoleId = 2 AND u.Email LIKE '%@tkdhub.com.ar'
UNION ALL
SELECT 'Total Argentine Students' as Metric, COUNT(*) as Count
FROM [dbo].[Users] u
INNER JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId
WHERE uur.UserRoleId = 3 AND u.Email LIKE '%@gmail.com'
UNION ALL
SELECT 'Total Argentine Dojangs' as Metric, COUNT(*) as Count
FROM [dbo].[Dojaangs]
WHERE Name NOT IN ('Dojang 1', 'Dojang 2')
UNION ALL
SELECT 'Total Training Classes' as Metric, COUNT(*) as Count
FROM [dbo].[TrainingClasses] tc
INNER JOIN [dbo].[Dojaangs] d ON tc.DojaangId = d.Id
WHERE d.Name NOT IN ('Dojang 1', 'Dojang 2')
UNION ALL
SELECT 'Active Dojangs with Coaches' as Metric, COUNT(*) as Count
FROM [dbo].[Dojaangs]
WHERE CoachId IS NOT NULL AND IsActive = 1 AND Name NOT IN ('Dojang 1', 'Dojang 2');

PRINT ''
PRINT 'Argentine TKD Hub sample data insertion completed successfully!'
PRINT '=============================================================='
