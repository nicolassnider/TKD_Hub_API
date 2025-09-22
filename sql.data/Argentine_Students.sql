-- Enhanced Argentine Students Data for TKD Hub
-- This file contains sample data with authentic Argentine names and realistic details

USE [TKDHubDb]
GO

-- Insert students with Argentine names and details (ages 8-25)
INSERT INTO [dbo].[Users] ([FirstName], [LastName], [Email], [PasswordHash], [DateOfBirth], [Gender], [PhoneNumber], [DojaangId], [CurrentRankId], [JoinDate], [IsActive], [CreatedAt], [UpdatedAt])
VALUES
-- Children and teenagers (8-17 years old)
('Tomás', 'Acuña Morales', 'tomas.acuna@gmail.com', '$2a$11$dummy.hash.for.development', '2015-03-15', 'MALE', '+54 11 5678-9001', 1, 1, '2023-02-10', 1, '2023-02-10', '2024-09-20'), -- White belt
('Valentina', 'Benitez Sosa', 'valentina.benitez@gmail.com', '$2a$11$dummy.hash.for.development', '2014-07-22', 'FEMALE', '+54 11 5678-9002', 1, 2, '2022-08-15', 1, '2022-08-15', '2024-09-20'), -- Yellow belt
('Benjamín', 'Cardozo Luna', 'benjamin.cardozo@gmail.com', '$2a$11$dummy.hash.for.development', '2016-11-08', 'MALE', '+54 11 5678-9003', 1, 1, '2024-01-20', 1, '2024-01-20', '2024-09-20'), -- White belt
('Catalina', 'Díaz Peralta', 'catalina.diaz@gmail.com', '$2a$11$dummy.hash.for.development', '2013-04-12', 'FEMALE', '+54 11 5678-9004', 1, 4, '2021-06-05', 1, '2021-06-05', '2024-09-20'), -- Green belt
('Facundo', 'Espinoza Ramos', 'facundo.espinoza@gmail.com', '$2a$11$dummy.hash.for.development', '2015-09-30', 'MALE', '+54 11 5678-9005', 1, 2, '2023-04-12', 1, '2023-04-12', '2024-09-20'), -- Yellow belt
('Milagros', 'Figueroa Silva', 'milagros.figueroa@gmail.com', '$2a$11$dummy.hash.for.development', '2014-12-17', 'FEMALE', '+54 11 5678-9006', 1, 3, '2022-11-08', 1, '2022-11-08', '2024-09-20'), -- Orange belt
('Ignacio', 'Gallardo Torres', 'ignacio.gallardo@gmail.com', '$2a$11$dummy.hash.for.development', '2016-02-25', 'MALE', '+54 11 5678-9007', 1, 1, '2024-03-18', 1, '2024-03-18', '2024-09-20'), -- White belt
('Amparo', 'Herrera Valdez', 'amparo.herrera@gmail.com', '$2a$11$dummy.hash.for.development', '2013-08-14', 'FEMALE', '+54 11 5678-9008', 1, 5, '2021-01-22', 1, '2021-01-22', '2024-09-20'), -- Blue belt
('Joaquín', 'Ibáñez Moreno', 'joaquin.ibanez@gmail.com', '$2a$11$dummy.hash.for.development', '2015-05-03', 'MALE', '+54 11 5678-9009', 1, 3, '2023-07-15', 1, '2023-07-15', '2024-09-20'), -- Orange belt
('Lucía', 'Juárez Ponce', 'lucia.juarez@gmail.com', '$2a$11$dummy.hash.for.development', '2014-10-19', 'FEMALE', '+54 11 5678-9010', 1, 4, '2022-03-28', 1, '2022-03-28', '2024-09-20'), -- Green belt

-- Young adults (18-25 years old)
('Santiago', 'Krauss Mendoza', 'santiago.krauss@gmail.com', '$2a$11$dummy.hash.for.development', '2004-01-18', 'MALE', '+54 11 5678-9011', 1, 7, '2020-09-10', 1, '2020-09-10', '2024-09-20'), -- Red belt
('Camila', 'Leguizamón Paz', 'camila.leguizamon@gmail.com', '$2a$11$dummy.hash.for.development', '2003-06-25', 'FEMALE', '+54 11 5678-9012', 1, 8, '2019-05-14', 1, '2019-05-14', '2024-09-20'), -- Brown belt
('Maximiliano', 'Molina Quiroga', 'maximiliano.molina@gmail.com', '$2a$11$dummy.hash.for.development', '2005-11-12', 'MALE', '+54 11 5678-9013', 1, 6, '2021-02-20', 1, '2021-02-20', '2024-09-20'), -- Purple belt
('Antonella', 'Navarro Rojas', 'antonella.navarro@gmail.com', '$2a$11$dummy.hash.for.development', '2002-04-07', 'FEMALE', '+54 11 5678-9014', 1, 9, '2018-08-30', 1, '2018-08-30', '2024-09-20'), -- Black stripe
('Thiago', 'Ocampo Silva', 'thiago.ocampo@gmail.com', '$2a$11$dummy.hash.for.development', '2006-09-23', 'MALE', '+54 11 5678-9015', 1, 5, '2022-01-15', 1, '2022-01-15', '2024-09-20'), -- Blue belt
('Paloma', 'Pereyra Torres', 'paloma.pereyra@gmail.com', '$2a$11$dummy.hash.for.development', '2004-12-08', 'FEMALE', '+54 11 5678-9016', 1, 7, '2020-11-22', 1, '2020-11-22', '2024-09-20'), -- Red belt
('Gonzalo', 'Quintana Vega', 'gonzalo.quintana@gmail.com', '$2a$11$dummy.hash.for.development', '2001-03-16', 'MALE', '+54 11 5678-9017', 1, 10, '2017-12-05', 1, '2017-12-05', '2024-09-20'), -- Red/Black
('Brisa', 'Ramírez Aguilar', 'brisa.ramirez@gmail.com', '$2a$11$dummy.hash.for.development', '2005-07-29', 'FEMALE', '+54 11 5678-9018', 1, 6, '2021-10-18', 1, '2021-10-18', '2024-09-20'), -- Purple belt
('Lautaro', 'Sánchez Blanco', 'lautaro.sanchez@gmail.com', '$2a$11$dummy.hash.for.development', '2003-02-14', 'MALE', '+54 11 5678-9019', 1, 8, '2019-04-12', 1, '2019-04-12', '2024-09-20'), -- Brown belt
('Jazmín', 'Toledo Cruz', 'jazmin.toledo@gmail.com', '$2a$11$dummy.hash.for.development', '2006-05-31', 'FEMALE', '+54 11 5678-9020', 1, 5, '2022-07-25', 1, '2022-07-25', '2024-09-20'), -- Blue belt

-- Students from different provinces
('Emiliano', 'Urquiza Dominguez', 'emiliano.urquiza@gmail.com', '$2a$11$dummy.hash.for.development', '2007-08-16', 'MALE', '+54 351 567-8901', 2, 4, '2021-12-10', 1, '2021-12-10', '2024-09-20'), -- Córdoba
('Delfina', 'Villarreal Escobar', 'delfina.villarreal@gmail.com', '$2a$11$dummy.hash.for.development', '2008-01-22', 'FEMALE', '+54 261 567-8902', 3, 3, '2022-05-18', 1, '2022-05-18', '2024-09-20'), -- Mendoza
('Bautista', 'Wainstein Fernández', 'bautista.wainstein@gmail.com', '$2a$11$dummy.hash.for.development', '2009-06-09', 'MALE', '+54 341 567-8903', 4, 2, '2023-03-25', 1, '2023-03-25', '2024-09-20'), -- Rosario
('Guadalupe', 'Yáñez Herrera', 'guadalupe.yanez@gmail.com', '$2a$11$dummy.hash.for.development', '2010-11-05', 'FEMALE', '+54 381 567-8904', 5, 1, '2024-01-08', 1, '2024-01-08', '2024-09-20'), -- Tucumán
('Blas', 'Zapata Iglesias', 'blas.zapata@gmail.com', '$2a$11$dummy.hash.for.development', '2011-04-20', 'MALE', '+54 223 567-8905', 6, 1, '2024-02-15', 1, '2024-02-15', '2024-09-20'), -- Mar del Plata

-- Family members (siblings and parents)
('Matías', 'Acuña Morales', 'matias.acuna@gmail.com', '$2a$11$dummy.hash.for.development', '2012-09-12', 'MALE', '+54 11 5678-9021', 1, 2, '2023-02-10', 1, '2023-02-10', '2024-09-20'), -- Tomás' brother
('Roberto', 'Acuña Morales', 'roberto.acuna@gmail.com', '$2a$11$dummy.hash.for.development', '1985-06-18', 'MALE', '+54 11 5678-9022', 1, 4, '2023-02-10', 1, '2023-02-10', '2024-09-20'), -- Father
('Sofía', 'Benitez Sosa', 'sofia.benitez@gmail.com', '$2a$11$dummy.hash.for.development', '2016-12-03', 'FEMALE', '+54 11 5678-9023', 1, 1, '2022-08-15', 1, '2022-08-15', '2024-09-20'), -- Valentina's sister
('Marina', 'Díaz Peralta', 'marina.diaz@gmail.com', '$2a$11$dummy.hash.for.development', '1987-11-25', 'FEMALE', '+54 11 5678-9024', 1, 6, '2021-06-05', 1, '2021-06-05', '2024-09-20'), -- Mother
('Franco', 'Gallardo Torres', 'franco.gallardo@gmail.com', '$2a$11$dummy.hash.for.development', '2018-07-14', 'MALE', '+54 11 5678-9025', 1, 1, '2024-03-18', 1, '2024-03-18', '2024-09-20'); -- Ignacio's brother

GO

-- Assign student roles to all the new users
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId])
SELECT 
    u.Id, 
    3 as UserRoleId  -- 3 = Student role
FROM [dbo].[Users] u
WHERE (u.Email LIKE '%@gmail.com' OR u.FirstName IN ('Matías', 'Roberto', 'Sofía', 'Marina', 'Franco'))
AND NOT EXISTS (
    SELECT 1 FROM [dbo].[UserUserRoles] uur 
    WHERE uur.UserId = u.Id AND uur.UserRoleId = 3
);

GO

-- Display the newly created students organized by dojang and rank
SELECT 
    d.Name as Dojang,
    u.FirstName + ' ' + u.LastName as FullName,
    u.Email,
    u.PhoneNumber,
    DATEDIFF(YEAR, u.DateOfBirth, GETDATE()) as Age,
    r.Name as CurrentRank,
    u.JoinDate
FROM [dbo].[Users] u
LEFT JOIN [dbo].[Dojaangs] d ON u.DojaangId = d.Id
LEFT JOIN [dbo].[Ranks] r ON u.CurrentRankId = r.Id
LEFT JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId
WHERE uur.UserRoleId = 3 -- Students only
AND (u.Email LIKE '%@gmail.com' OR u.FirstName IN ('Matías', 'Roberto', 'Sofía', 'Marina', 'Franco'))
ORDER BY d.Name, r.Id, u.FirstName;
