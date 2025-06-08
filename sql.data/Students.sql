-- add 23 students
USE [TKDHubDb]
GO

INSERT INTO [dbo].[Users] ([FirstName], [LastName], [Email], [PasswordHash], [DateOfBirth], [Gender], [PhoneNumber], [DojaangId], [CurrentRankId], [JoinDate], [IsActive], [CreatedAt], [UpdatedAt])
VALUES
('Lucas', 'García', 'lucas.garcia@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5701', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Sofía', 'Martínez', 'sofia.martinez@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5702', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Mateo', 'López', 'mateo.lopez@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5703', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Valeria', 'Sánchez', 'valeria.sanchez@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5704', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Emilio', 'Ramírez', 'emilio.ramirez@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5705', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Lucía', 'Fernández', 'lucia.fernandez@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5706', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Javier', 'González', 'javier.gonzalez@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5707', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Camila', 'Torres', 'camila.torres@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5708', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Diego', 'Mendoza', 'diego.mendoza@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5709', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Renata', 'Cruz', 'renata.cruz@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5710', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Juan', 'Salazar', 'juan.salazar@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5711', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('María', 'Pérez', 'maria.perez@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5712', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Felipe', 'Alvarez', 'felipe.alvarez@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5713', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Gabriela', 'Jiménez', 'gabriela.jimenez@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5714', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Emilia', 'Maldonado', 'emilia.maldonado@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5715', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Cristian', 'Ríos', 'cristian.rios@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5716', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Martín', 'Cordero', 'martin.cordero@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5717', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Ana', 'Salas', 'ana.salas@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5718', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Gonzalo', 'Ponce', 'gonzalo.ponce@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5719', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Luciana', 'Mora', 'luciana.mora@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5720', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Martina', 'Cruz', 'martina.cruz@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'female', '+54 9 11 1234-5721', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Pablo', 'García', 'pablo.garcia@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5722', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE())),
('Agustín', 'Hernández', 'agustin.hernandez@example.com', '', DATEADD(YEAR, -ABS(CHECKSUM(NEWID()) % 9) - 7, GETDATE()), 'male', '+54 9 11 1234-5723', 1, ABS(CHECKSUM(NEWID()) % 9) + 1, DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), CAST(CAST(ABS(CHECKSUM(NEWID()) % 2) AS INT) AS BIT), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()), DATEADD(YEAR, ABS(CHECKSUM(NEWID()) % 5) + 2020, GETDATE()));
GO


-- manage roles

USE [TKDHubDb]
GO

INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (32, 3, 30);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (33, 2, 31);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (34, 2, 32);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (35, 2, 33);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (36, 2, 34);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (37, 2, 35);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (38, 2, 36);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (39, 2, 37);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (40, 2, 38);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (41, 2, 39);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (42, 2, 40);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (43, 2, 41);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (44, 2, 42);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (45, 2, 43);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (46, 2, 44);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (47, 2, 45);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (48, 2, 46);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (49, 2, 47);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (50, 2, 48);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (51, 2, 49);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (52, 2, 50);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (53, 2, 51);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (54, 2, 52);
GO