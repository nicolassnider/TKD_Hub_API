-- Complete Taekwondo Belt Ranking System
-- This file creates the complete belt progression from White Belt (10th Gup) to 9th Dan Black Belt
-- Following traditional ITF Taekwondo ranking system

USE [TKDHubDb]
GO

PRINT 'Inserting complete Taekwondo ranking system...';

-- Insert complete ranking system
INSERT INTO [dbo].[Ranks] ([Id], [Name], [Color], [Order], [CreatedAt], [UpdatedAt])
VALUES
-- Gup Ranks (Colored Belts) - 10th Gup to 1st Gup
(1, 'White Belt', 'White', 1, GETDATE(), GETDATE()),
(2, 'White Belt with Yellow Stripe', 'White', 2, GETDATE(), GETDATE()),
(3, 'Yellow Belt', 'Yellow', 3, GETDATE(), GETDATE()),
(4, 'Yellow Belt with Green Stripe', 'Yellow', 4, GETDATE(), GETDATE()),
(5, 'Green Belt', 'Green', 5, GETDATE(), GETDATE()),
(6, 'Green Belt with Blue Stripe', 'Green', 6, GETDATE(), GETDATE()),
(7, 'Blue Belt', 'Blue', 7, GETDATE(), GETDATE()),
(8, 'Blue Belt with Red Stripe', 'Blue', 8, GETDATE(), GETDATE()),
(9, 'Red Belt', 'Red', 9, GETDATE(), GETDATE()),
(10, 'Red Belt with Black Stripe', 'Red', 10, GETDATE(), GETDATE()),

-- Dan Ranks (Black Belts) - 1st Dan to 9th Dan
(11, 'Black Belt 1st Dan', 'Black', 11, GETDATE(), GETDATE()),
(12, 'Black Belt 2nd Dan', 'Black', 12, GETDATE(), GETDATE()),
(13, 'Black Belt 3rd Dan', 'Black', 13, GETDATE(), GETDATE()),
(14, 'Black Belt 4th Dan', 'Black', 14, GETDATE(), GETDATE()),
(15, 'Black Belt 5th Dan', 'Black', 15, GETDATE(), GETDATE()),
(16, 'Black Belt 6th Dan', 'Black', 16, GETDATE(), GETDATE()),
(17, 'Black Belt 7th Dan', 'Black', 17, GETDATE(), GETDATE()),
(18, 'Black Belt 8th Dan', 'Black', 18, GETDATE(), GETDATE()),
(19, 'Black Belt 9th Dan', 'Black', 19, GETDATE(), GETDATE()),

-- Special Ranks
(20, 'Black Belt 9th Dan (Grand Master)', 'Black', 20, GETDATE(), GETDATE());

PRINT 'Complete ranking system inserted successfully.';
PRINT 'Total ranks created: 20 (10 Gup + 9 Dan + 1 Grand Master)';

-- Display the ranking system
SELECT [Id], [Name], [Color], [Order] 
FROM [dbo].[Ranks] 
ORDER BY [Order];

GO
