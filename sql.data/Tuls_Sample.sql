-- Taekwondo Tuls (Forms) Sample Data  
-- This file creates sample Tuls covering the traditional ITF forms progression
-- Each Tul includes techniques and movements for complete form practice

USE [TKDHubDb]
GO

PRINT 'Inserting Taekwondo Tuls (Forms) sample data...';

-- Insert traditional ITF Tuls
INSERT INTO [dbo].[Tuls] ([Name], [Description], [RecommendedRankId], [ImageUrl], [VideoUrl], [CreatedAt], [UpdatedAt])
VALUES
-- Basic Forms (Gup Ranks)
('Chon-Ji', 'Heaven and Earth - First form representing the creation of the world and beginning of human history. Contains 19 movements.', 3, 'https://example.com/tuls/chonji.jpg', 'https://example.com/videos/chonji'),

('Dan-Gun', 'Named after the holy Dan-Gun, legendary founder of Korea in 2333 BC. Contains 21 movements.', 4, 'https://example.com/tuls/dangun.jpg', 'https://example.com/videos/dangun'),

('Do-San', 'Named after the patriot Ahn Chang-Ho (1876-1938) who devoted his life to furthering Korean independence. Contains 24 movements.', 5, 'https://example.com/tuls/dosan.jpg', 'https://example.com/videos/dosan'),

('Won-Hyo', 'Named after the monk Won-Hyo who introduced Buddhism to the Silla Dynasty in 686 AD. Contains 28 movements.', 6, 'https://example.com/tuls/wonhyo.jpg', 'https://example.com/videos/wonhyo'),

('Yul-Gok', 'Named after the great philosopher Yi I (1536-1584) nicknamed Yul-Gok. Contains 38 movements.', 7, 'https://example.com/tuls/yulgok.jpg', 'https://example.com/videos/yulgok'),

('Joong-Gun', 'Named after the patriot Ahn Joong-Gun who assassinated Hiro-Bumi Ito in 1909. Contains 32 movements.', 8, 'https://example.com/tuls/joonggun.jpg', 'https://example.com/videos/joonggun'),

('Toi-Gye', 'Named after the noted scholar Yi Hwang (1501-1570) known by his pen name Toi-Gye. Contains 37 movements.', 9, 'https://example.com/tuls/toigye.jpg', 'https://example.com/videos/toigye'),

('Hwa-Rang', 'Named after the Hwa-Rang youth group which originated in the Silla Dynasty about 1350 years ago. Contains 29 movements.', 10, 'https://example.com/tuls/hwarang.jpg', 'https://example.com/videos/hwarang'),

-- Black Belt Forms (Dan Ranks)
('Choong-Moo', 'Named after Admiral Yi Soon-Sin who invented the first armored battleship (Kobukson) in 1592. Contains 30 movements.', 11, 'https://example.com/tuls/choongmoo.jpg', 'https://example.com/videos/choongmoo'),

('Kwang-Gae', 'Named after the famous Kwang-Gae-Toh-Wang, the 19th king of the Koguryo Dynasty. Contains 39 movements.', 12, 'https://example.com/tuls/kwanggae.jpg', 'https://example.com/videos/kwanggae'),

('Po-Eun', 'Named after the poet Chong Mong-Chu (1400) whose pen name was Po-Eun. Contains 36 movements.', 13, 'https://example.com/tuls/poeun.jpg', 'https://example.com/videos/poeun'),

('Ge-Baek', 'Named after Ge-Baek, a great general in the Baek-Je Dynasty (660 AD). Contains 44 movements.', 14, 'https://example.com/tuls/gebaek.jpg', 'https://example.com/videos/gebaek'),

('Eui-Am', 'Named after Son Byong-Hi, leader of the Korean independence movement on March 1st, 1919. Contains 45 movements.', 15, 'https://example.com/tuls/euiam.jpg', 'https://example.com/videos/euiam'),

('Choong-Jang', 'Named after General Kim Duk-Ryang who died at 27 while fighting the Japanese invasion. Contains 52 movements.', 16, 'https://example.com/tuls/choongjang.jpg', 'https://example.com/videos/choongjang'),

('Juche', 'Named after the Juche idea which is the philosophical idea that man is the master of everything. Contains 45 movements.', 17, 'https://example.com/tuls/juche.jpg', 'https://example.com/videos/juche'),

-- Advanced Forms (High Dan Ranks)
('Sam-Il', 'Named after the Sam-Il independence movement of Korea which started on March 1st, 1919. Contains 33 movements.', 18, 'https://example.com/tuls/samil.jpg', 'https://example.com/videos/samil'),

('Yoo-Sin', 'Named after General Kim Yoo-Sin, commanding general during the Silla Dynasty. Contains 68 movements.', 19, 'https://example.com/tuls/yoosin.jpg', 'https://example.com/videos/yoosin'),

('Choi-Yong', 'Named after General Choi-Yong, premier and commander-in-chief of the armed forces during the 14th century. Contains 46 movements.', 19, 'https://example.com/tuls/choiyong.jpg', 'https://example.com/videos/choiyong');

PRINT 'Taekwondo Tuls inserted successfully.';
PRINT 'Total Tuls created: 18 traditional ITF forms';

-- Now insert sample techniques for some Tuls (TulTechniques junction table)
PRINT 'Adding technique sequences to Tuls...';

-- Get some basic technique IDs for demonstration
DECLARE @ApChagi INT = (SELECT Id FROM Techniques WHERE Name = 'Ap Chagi');
DECLARE @NajundeMakgi INT = (SELECT Id FROM Techniques WHERE Name = 'Najunde Makgi');
DECLARE @ApJoomuk INT = (SELECT Id FROM Techniques WHERE Name = 'Ap Joomuk Jirugi');
DECLARE @KaundeMakgi INT = (SELECT Id FROM Techniques WHERE Name = 'Kaunde Makgi');
DECLARE @DollyoChagi INT = (SELECT Id FROM Techniques WHERE Name = 'Dollyo Chagi');

-- Get Tul IDs
DECLARE @ChonjTul INT = (SELECT Id FROM Tuls WHERE Name = 'Chon-Ji');
DECLARE @DangunTul INT = (SELECT Id FROM Tuls WHERE Name = 'Dan-Gun');
DECLARE @DosanTul INT = (SELECT Id FROM Tuls WHERE Name = 'Do-San');

-- Add technique sequences for Chon-Ji (Basic form)
IF @ChonjTul IS NOT NULL AND @NajundeMakgi IS NOT NULL
BEGIN
    INSERT INTO [dbo].[TulTechniques] ([TulId], [TechniqueId], [Order])
    VALUES 
    (@ChonjTul, @NajundeMakgi, 1),
    (@ChonjTul, @ApJoomuk, 2),
    (@ChonjTul, @NajundeMakgi, 3),
    (@ChonjTul, @ApJoomuk, 4),
    (@ChonjTul, @KaundeMakgi, 5);
    
    PRINT 'Added technique sequence for Chon-Ji';
END

-- Add technique sequences for Dan-Gun
IF @DangunTul IS NOT NULL AND @ApChagi IS NOT NULL
BEGIN
    INSERT INTO [dbo].[TulTechniques] ([TulId], [TechniqueId], [Order])
    VALUES 
    (@DangunTul, @KaundeMakgi, 1),
    (@DangunTul, @ApJoomuk, 2),
    (@DangunTul, @ApChagi, 3),
    (@DangunTul, @NajundeMakgi, 4),
    (@DangunTul, @DollyoChagi, 5);
    
    PRINT 'Added technique sequence for Dan-Gun';
END

-- Add technique sequences for Do-San
IF @DosanTul IS NOT NULL AND @DollyoChagi IS NOT NULL
BEGIN
    INSERT INTO [dbo].[TulTechniques] ([TulId], [TechniqueId], [Order])
    VALUES 
    (@DosanTul, @ApJoomuk, 1),
    (@DosanTul, @KaundeMakgi, 2),
    (@DosanTul, @DollyoChagi, 3),
    (@DosanTul, @ApChagi, 4),
    (@DosanTul, @NajundeMakgi, 5),
    (@DosanTul, @ApJoomuk, 6);
    
    PRINT 'Added technique sequence for Do-San';
END

-- Display Tuls with their recommended ranks
SELECT 
    t.Name as TulName,
    t.Description,
    r.Name as RecommendedRank,
    (SELECT COUNT(*) FROM TulTechniques tt WHERE tt.TulId = t.Id) as TechniqueCount
FROM [dbo].[Tuls] t
LEFT JOIN [dbo].[Ranks] r ON t.RecommendedRankId = r.Id
ORDER BY t.RecommendedRankId;

GO
