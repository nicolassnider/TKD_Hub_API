-- Enhanced Argentine Coaches Data for TKD Hub
-- This file contains sample data with authentic Argentine names and locations

USE [TKDHubDb]
GO

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

GO

-- Assign coach roles to all the new users
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId])
SELECT 
    u.Id, 
    2 as UserRoleId  -- 2 = Coach role
FROM [dbo].[Users] u
WHERE u.Email LIKE '%@tkdhub.com.ar'
AND NOT EXISTS (
    SELECT 1 FROM [dbo].[UserUserRoles] uur 
    WHERE uur.UserId = u.Id AND uur.UserRoleId = 2
);

GO

-- Display the newly created coaches
SELECT 
    u.Id,
    u.FirstName + ' ' + u.LastName as FullName,
    u.Email,
    u.PhoneNumber,
    r.Name as CurrentRank,
    ur.Name as Role
FROM [dbo].[Users] u
LEFT JOIN [dbo].[Ranks] r ON u.CurrentRankId = r.Id
LEFT JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId
LEFT JOIN [dbo].[UserRoles] ur ON uur.UserRoleId = ur.Id
WHERE u.Email LIKE '%@tkdhub.com.ar'
ORDER BY u.CurrentRankId DESC, u.FirstName;
