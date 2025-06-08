-- create users

USE [TKDHubDb]
GO

INSERT INTO [dbo].[Users] ([FirstName], [LastName], [Email], [PasswordHash], [DateOfBirth], [Gender], [PhoneNumber], [DojaangId], [CurrentRankId], [JoinDate], [IsActive], [CreatedAt], [UpdatedAt])
VALUES
('Juan', 'Pérez', 'juan.perez@example.com', '', '1990-05-15', 'MALE', '+54 9 11 1234-5671', NULL, 15, '2020-03-01', 1, '2020-03-01', '2020-03-01'),
('María', 'González', 'maria.gonzalez@example.com', '', '1985-08-22', 'FEMALE', '+54 9 11 1234-5672', NULL, 12, '2019-07-15', 1, '2019-07-15', '2019-07-15'),
('Carlos', 'López', 'carlos.lopez@example.com', '', '1992-11-30', 'MALE', '+54 9 11 1234-5673', NULL, 14, '2021-01-10', 1, '2021-01-10', '2021-01-10'),
('Ana', 'Martínez', 'ana.martinez@example.com', '', '1988-03-05', 'FEMALE', '+54 9 11 1234-5674', NULL, 13, '2018-05-20', 1, '2018-05-20', '2018-05-20'),
('Luis', 'Hernández', 'luis.hernandez@example.com', '', '1995-12-12', 'MALE', '+54 9 11 1234-5675', NULL, 16, '2022-09-25', 1, '2022-09-25', '2022-09-25'),
('Sofía', 'Ramírez', 'sofia.ramirez@example.com', '', '1993-06-18', 'FEMALE', '+54 9 11 1234-5676', NULL, 17, '2023-02-14', 1, '2023-02-14', '2023-02-14'),
('Diego', 'Torres', 'diego.torres@example.com', '', '1987-04-30', 'MALE', '+54 9 11 1234-5677', NULL, 11, '2017-11-11', 1, '2017-11-11', '2017-11-11'),
('Lucía', 'Flores', 'lucia.flores@example.com', '', '1991-01-25', 'FEMALE', '+54 9 11 1234-5678', NULL, 19, '2020-08-30', 1, '2020-08-30', '2020-08-30'),
('Javier', 'García', 'javier.garcia@example.com', '', '1989-09-10', 'MALE', '+54 9 11 1234-5679', NULL, 18, '2021-12-05', 1, '2021-12-05', '2021-12-05'),
('Valentina', 'Sánchez', 'valentina.sanchez@example.com', '', '1994-07-20', 'FEMALE', '+54 9 11 1234-5680', NULL, 12, '2016-04-15', 1, '2016-04-15', '2016-04-15'),
('Fernando', 'Mendoza', 'fernando.mendoza@example.com', '', '1986-10-08', 'MALE', '+54 9 11 1234-5681', NULL, 14, '2018-06-22', 1, '2018-06-22', '2018-06-22'),
('Camila', 'Jiménez', 'camila.jimenez@example.com', '', '1992-02-14', 'FEMALE', '+54 9 11 1234-5682', NULL, 15, '2019-03-30', 1, '2019-03-30', '2019-03-30'),
('Andrés', 'Vásquez', 'andres.vasquez@example.com', '', '1990-12-01', 'MALE', '+54 9 11 1234-5683', NULL, 13, '2020-01-18', 1, '2020-01-18', '2020-01-18'),
('Isabella', 'Cruz', 'isabella.cruz@example.com', '', '1995-03-27', 'FEMALE', '+54 9 11 1234-5684', NULL, 16, '2021-05-11', 1, '2021-05-11', '2021-05-11'),
('Mateo', 'Rojas', 'mateo.rojas@example.com', '', '1988-08-19', 'MALE', '+54 9 11 1234-5685', NULL, 17, '2022-07-22', 1, '2022-07-22', '2022-07-22'),
('Valeria', 'Ponce', 'valeria.ponce@example.com', '', '1991-05-09', 'FEMALE', '+54 9 11 1234-5686', NULL, 19, '2023-01-01', 1, '2023-01-01', '2023-01-01'),
('Nicolás', 'Salazar', 'nicolas.salazar@example.com', '', '1994-11-15', 'MALE', '+54 9 11 1234-5687', NULL, 12, '2018-02-20', 1, '2018-02-20', '2018-02-20'),
('Mariana', 'Ortega', 'mariana.ortega@example.com', '', '1986-06-28', 'FEMALE', '+54 9 11 1234-5688', NULL, 14, '2019-04-10', 1, '2019-04-10', '2019-04-10'),
('Sebastián', 'Mora', 'sebastian.mora@example.com', '', '1993-07-14', 'MALE', '+54 9 11 1234-5689', NULL, 15, '2020-09-12', 1, '2020-09-12', '2020-09-12'),
('Camilo', 'Núñez', 'camilo.nunez@example.com', '', '1990-04-20', 'MALE', '+54 9 11 1234-5690', NULL, 18, '2021-06-15', 1, '2021-06-15', '2021-06-15'),
('Luciana', 'Soto', 'luciana.soto@example.com', '', '1995-09-30', 'FEMALE', '+54 9 11 1234-5691', NULL, 19, '2022-10-25', 1, '2022-10-25', '2022-10-25'),
('Felipe', 'Cordero', 'felipe.cordero@example.com', '', '1989-12-11', 'MALE', '+54 9 11 1234-5692', NULL, 16, '2023-03-18', 1, '2023-03-18', '2023-03-18'),
('Gabriela', 'Alvarez', 'gabriela.alvarez@example.com', '', '1992-08-05', 'FEMALE', '+54 9 11 1234-5693', NULL, 12, '2016-11-30', 1, '2016-11-30', '2016-11-30'),
('Emilio', 'Cáceres', 'emilio.caceres@example.com', '', '1987-03-17', 'MALE', '+54 9 11 1234-5694', NULL, 14, '2017-12-22', 1, '2017-12-22', '2017-12-22'),
('Renata', 'Ríos', 'renata.rios@example.com', '', '1994-10-10', 'FEMALE', '+54 9 11 1234-5695', NULL, 13, '2018-08-14', 1, '2018-08-14', '2018-08-14'),
('Joaquín', 'Gonzalez', 'joaquin.gonzalez@example.com', '', '1991-01-01', 'MALE', '+54 9 11 1234-5696', NULL, 19, '2020-04-25', 1, '2020-04-25', '2020-04-25'),
('Valeria', 'Pérez', 'valeria.perez@example.com', '', '1993-02-28', 'FEMALE', '+54 9 11 1234-5697', NULL, 15, '2021-07-30', 1, '2021-07-30', '2021-07-30'),
('Cristian', 'Salas', 'cristian.salas@example.com', '', '1988-11-11', 'MALE', '+54 9 11 1234-5698', NULL, 12, '2019-09-19', 1, '2019-09-19', '2019-09-19'),
('Marisol', 'Maldonado', 'marisol.maldonado@example.com', '', '1990-04-05', 'FEMALE', '+54 9 11 1234-5699', NULL, 14, '2020-12-12', 1, '2020-12-12', '2020-12-12');
GO

select id from Users

-- create user userroles
USE [TKDHubDb]
GO

INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (3, 2, 1);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (4, 2, 2);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (5, 2, 3);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (6, 2, 4);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (7, 2, 5);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (8, 2, 6);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (9, 2, 7);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (10, 2, 8);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (11, 2, 9);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (12, 2, 10);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (13, 2, 11);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (14, 2, 12);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (15, 2, 13);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (16, 2, 14);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (17, 2, 15);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (18, 2, 16);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (19, 2, 17);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (20, 2, 18);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (21, 2, 19);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (22, 2, 20);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (23, 2, 21);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (24, 2, 22);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (25, 2, 23);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (26, 2, 24);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (27, 2, 25);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (28, 2, 26);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (29, 2, 27);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (30, 2, 28);
INSERT INTO [dbo].[UserUserRoles] ([UserId], [UserRoleId], [Id]) VALUES (31, 2, 29);
GO
