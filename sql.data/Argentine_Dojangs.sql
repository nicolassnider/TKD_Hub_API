-- Enhanced Argentine Dojangs Data for TKD Hub
-- This file contains sample data with authentic Argentine locations and dojang names

USE [TKDHubDb]
GO

-- Insert dojangs with authentic Argentine locations and Korean-inspired names
INSERT INTO [dbo].[Dojaangs]
           ([Name]
           ,[Address]
           ,[Location]
           ,[PhoneNumber]
           ,[Email]
           ,[KoreanName]
           ,[KoreanNamePhonetic]
           ,[CoachId]
           ,[IsActive]
           ,[CreatedAt]
           ,[UpdatedAt])
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

-- Córdoba
('Montaña Sagrada Dojang', 'Av. Colón 1445', 'Córdoba Capital, Córdoba', '+54 351 423-7890', 'montanasagrada@cordoba-tkd.com.ar', N'성산', 'Seongsan', NULL, 1, '2013-07-15', '2024-09-20'),
('Cóndor Andino Academia', 'Bv. San Juan 987', 'Córdoba Capital, Córdoba', '+54 351 456-1122', 'condorandino@tkd.com.ar', N'안데스콘도르', 'Andeseu Kondor', NULL, 1, '2016-05-30', '2024-09-20'),

-- Mendoza
('Escuela Aconcagua Taekwondo', 'San Martín 1234', 'Mendoza Capital, Mendoza', '+54 261 429-5678', 'aconcagua@mendoza-tkd.com.ar', N'아콘카과', 'Akonkagwa', NULL, 1, '2011-12-08', '2024-09-20'),
('Viento del Oeste Dojang', 'Las Heras 876', 'Mendoza Capital, Mendoza', '+54 261 423-9999', 'vientooeste@tkd.com.ar', N'서풍', 'Seopung', NULL, 1, '2018-10-25', '2024-09-20'),

-- Santa Fe (Rosario)
('Río Paraná Taekwondo', 'Córdoba 1567', 'Rosario, Santa Fe', '+54 341 424-7890', 'rioparana@rosario-tkd.com.ar', N'파라나강', 'Parana Gang', NULL, 1, '2015-01-20', '2024-09-20'),
('Guerreros del Litoral', 'Pellegrini 2345', 'Rosario, Santa Fe', '+54 341 456-2222', 'guerreroslitoral@tkd.com.ar', N'연안전사', 'Yeonan Jeonsa', NULL, 1, '2017-06-14', '2024-09-20'),

-- Tucumán
('Jardín del Norte Academia', 'San Martín 567', 'San Miguel de Tucumán, Tucumán', '+54 381 422-3456', 'jardindelnorte@tucuman-tkd.com.ar', N'북방정원', 'Bukbang Jeongwon', NULL, 1, '2014-11-03', '2024-09-20'),
('Cañaveral Taekwondo Club', '25 de Mayo 890', 'San Miguel de Tucumán, Tucumán', '+54 381 456-7788', 'canaveral@club-tkd.com.ar', N'사탕수수밭', 'Satangsusu Bat', NULL, 1, '2019-08-17', '2024-09-20'),

-- Salta
('Puna Dorada Dojang', 'Belgrano 1234', 'Salta Capital, Salta', '+54 387 431-5555', 'punadorada@salta-tkd.com.ar', N'황금고원', 'Hwanggeum Gowon', NULL, 1, '2016-03-22', '2024-09-20'),

-- Bariloche (Río Negro)
('Nahuel Huapi Taekwondo', 'Mitre 456', 'San Carlos de Bariloche, Río Negro', '+54 294 442-9999', 'nahuelhuapi@patagonia-tkd.com.ar', N'나우엘후아피', 'Nauel Huapi', NULL, 1, '2018-07-09', '2024-09-20'),

-- Neuquén
('Patagonia Norte Club', 'Av. Argentina 789', 'Neuquén Capital, Neuquén', '+54 299 442-7777', 'patagonia@norte-tkd.com.ar', N'북파타고니아', 'Buk Patagonia', NULL, 1, '2017-12-15', '2024-09-20'),

-- Mar del Plata
('Atlántico Sur Dojang', 'Güemes 1567', 'Mar del Plata, Buenos Aires', '+54 223 491-8888', 'atlantico@mardelplata-tkd.com.ar', N'남대서양', 'Nam Daeseoyang', NULL, 1, '2015-05-18', '2024-09-20');

GO

-- Update existing dojangs with Argentine coaches
UPDATE [dbo].[Dojaangs] 
SET CoachId = (SELECT TOP 1 u.Id FROM [dbo].[Users] u 
               INNER JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId 
               WHERE uur.UserRoleId = 2 AND u.Email LIKE '%@tkdhub.com.ar' 
               ORDER BY u.CurrentRankId DESC, NEWID())
WHERE Name = 'Tigre Dorado Taekwondo';

UPDATE [dbo].[Dojaangs] 
SET CoachId = (SELECT TOP 1 u.Id FROM [dbo].[Users] u 
               INNER JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId 
               WHERE uur.UserRoleId = 2 AND u.Email LIKE '%@tkdhub.com.ar' 
               AND u.Id != (SELECT CoachId FROM [dbo].[Dojaangs] WHERE Name = 'Tigre Dorado Taekwondo')
               ORDER BY u.CurrentRankId DESC, NEWID())
WHERE Name = 'Dragón Azul Academia';

UPDATE [dbo].[Dojaangs] 
SET CoachId = (SELECT TOP 1 u.Id FROM [dbo].[Users] u 
               INNER JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId 
               WHERE uur.UserRoleId = 2 AND u.Email LIKE '%@tkdhub.com.ar' 
               AND u.Id NOT IN (SELECT CoachId FROM [dbo].[Dojaangs] WHERE CoachId IS NOT NULL)
               ORDER BY u.CurrentRankId DESC, NEWID())
WHERE Name = 'Halcón del Sur Dojang';

UPDATE [dbo].[Dojaangs] 
SET CoachId = (SELECT TOP 1 u.Id FROM [dbo].[Users] u 
               INNER JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId 
               WHERE uur.UserRoleId = 2 AND u.Email LIKE '%@tkdhub.com.ar' 
               AND u.Id NOT IN (SELECT CoachId FROM [dbo].[Dojaangs] WHERE CoachId IS NOT NULL)
               ORDER BY u.CurrentRankId DESC, NEWID())
WHERE Name = 'Centro Kim Taekwondo';

UPDATE [dbo].[Dojaangs] 
SET CoachId = (SELECT TOP 1 u.Id FROM [dbo].[Users] u 
               INNER JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId 
               WHERE uur.UserRoleId = 2 AND u.Email LIKE '%@tkdhub.com.ar' 
               AND u.Id NOT IN (SELECT CoachId FROM [dbo].[Dojaangs] WHERE CoachId IS NOT NULL)
               ORDER BY u.CurrentRankId DESC, NEWID())
WHERE Name = 'Leones de Palermo';

-- Assign remaining coaches to other dojangs
UPDATE d
SET d.CoachId = subq.CoachId
FROM [dbo].[Dojaangs] d
INNER JOIN (
    SELECT 
        d.Id as DojaangId,
        u.Id as CoachId,
        ROW_NUMBER() OVER (ORDER BY d.Id) as rn
    FROM [dbo].[Dojaangs] d
    CROSS JOIN (
        SELECT u.Id, ROW_NUMBER() OVER (ORDER BY u.CurrentRankId DESC, NEWID()) as coach_rn
        FROM [dbo].[Users] u 
        INNER JOIN [dbo].[UserUserRoles] uur ON u.Id = uur.UserId 
        WHERE uur.UserRoleId = 2 AND u.Email LIKE '%@tkdhub.com.ar'
        AND u.Id NOT IN (SELECT CoachId FROM [dbo].[Dojaangs] WHERE CoachId IS NOT NULL)
    ) u
    WHERE d.CoachId IS NULL AND d.Id % 16 + 1 = u.coach_rn
) subq ON d.Id = subq.DojaangId;

GO

-- Display all dojangs with their assigned coaches
SELECT 
    d.Id,
    d.Name as DojaangName,
    d.Location,
    d.KoreanName,
    d.PhoneNumber,
    d.Email,
    ISNULL(c.FirstName + ' ' + c.LastName, 'Sin asignar') as CoachName,
    r.Name as CoachRank
FROM [dbo].[Dojaangs] d
LEFT JOIN [dbo].[Users] c ON d.CoachId = c.Id
LEFT JOIN [dbo].[Ranks] r ON c.CurrentRankId = r.Id
WHERE d.Name NOT IN ('Dojang 1', 'Dojang 2') -- Exclude original test data
ORDER BY d.Location, d.Name;

GO

-- Summary statistics
SELECT 
    'Total Dojangs' as Metric,
    COUNT(*) as Count
FROM [dbo].[Dojaangs] 
WHERE Name NOT IN ('Dojang 1', 'Dojang 2')
UNION ALL
SELECT 
    'Dojangs with Coaches' as Metric,
    COUNT(*) as Count
FROM [dbo].[Dojaangs] 
WHERE CoachId IS NOT NULL AND Name NOT IN ('Dojang 1', 'Dojang 2')
UNION ALL
SELECT 
    'Active Dojangs' as Metric,
    COUNT(*) as Count
FROM [dbo].[Dojaangs] 
WHERE IsActive = 1 AND Name NOT IN ('Dojang 1', 'Dojang 2');
