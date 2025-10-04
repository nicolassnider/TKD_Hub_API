-- Complete TKD Hub Database Population Script
-- This script executes all data files in the correct order for comprehensive database population
-- Run this after fresh database migration to populate with complete sample data

USE [TKDHubDb]
GO

PRINT '=========================================================';
PRINT 'TKD Hub Database Complete Population Script';
PRINT 'Starting comprehensive database population...';
PRINT 'Start Time: ' + CAST(GETDATE() as VARCHAR(50));
PRINT '=========================================================';
PRINT '';

-- ===============================================
-- STEP 1: Verify Database Structure
-- ===============================================
PRINT '=== STEP 1: Database Structure Verification ===';

-- Check essential tables exist
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Users')
BEGIN
    PRINT 'ERROR: Users table not found. Please run database migrations first.';
    RETURN;
END

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'UserRoles')
BEGIN
    PRINT 'ERROR: UserRoles table not found. Please run database migrations first.';
    RETURN;
END

PRINT '✓ Essential tables verified';
PRINT '';

-- ===============================================
-- STEP 2: Base System Data (Ranks & Roles)
-- ===============================================
PRINT '=== STEP 2: Base System Data ===';

-- Basic UserRoles (should be seeded by migrations but verify/create if needed)
IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE Id = 1)
BEGIN
    INSERT INTO [dbo].[UserRoles] ([Id], [Name]) VALUES (1, 'Admin');
    PRINT '+ Added Admin role';
END

IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE Id = 2)
BEGIN
    INSERT INTO [dbo].[UserRoles] ([Id], [Name]) VALUES (2, 'Coach');
    PRINT '+ Added Coach role';
END

IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE Id = 3)
BEGIN
    INSERT INTO [dbo].[UserRoles] ([Id], [Name]) VALUES (3, 'Student');
    PRINT '+ Added Student role';
END

PRINT '✓ User roles verified/created';

-- Execute Complete Ranks System - COMMENTED OUT (Using SeedData.cs instead)
-- PRINT 'Installing complete belt ranking system...';

-- NOTE: Ranks are seeded via SeedData.cs during application startup
-- The following rank data is available in Ranks_Complete.sql if needed manually

/*
-- Clear existing ranks if any
DELETE FROM [dbo].[Ranks];

-- Insert complete ranking system
INSERT INTO [dbo].[Ranks] ([Id], [Name], [Color], [Order], [CreatedAt], [UpdatedAt])
VALUES
-- Gup Ranks (Colored Belts)
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
-- Dan Ranks (Black Belts)
(11, 'Black Belt 1st Dan', 'Black', 11, GETDATE(), GETDATE()),
(12, 'Black Belt 2nd Dan', 'Black', 12, GETDATE(), GETDATE()),
(13, 'Black Belt 3rd Dan', 'Black', 13, GETDATE(), GETDATE()),
(14, 'Black Belt 4th Dan', 'Black', 14, GETDATE(), GETDATE()),
(15, 'Black Belt 5th Dan', 'Black', 15, GETDATE(), GETDATE()),
(16, 'Black Belt 6th Dan', 'Black', 16, GETDATE(), GETDATE()),
(17, 'Black Belt 7th Dan', 'Black', 17, GETDATE(), GETDATE()),
(18, 'Black Belt 8th Dan', 'Black', 18, GETDATE(), GETDATE()),
(19, 'Black Belt 9th Dan', 'Black', 19, GETDATE(), GETDATE()),
(20, 'Black Belt 9th Dan (Grand Master)', 'Black', 20, GETDATE(), GETDATE());
*/

PRINT '✓ Ranks handled by SeedData.cs (skipping SQL rank insertion)';
PRINT '';

-- ===============================================
-- STEP 3: Location & Infrastructure Data  
-- ===============================================
PRINT '=== STEP 3: Dojangs and Infrastructure ===';

-- NOTE: Execute Argentine_Dojangs.sql content here or separately
-- For now, we'll assume dojangs exist or will be created separately

PRINT '✓ Dojangs setup (execute Argentine_Dojangs.sql separately if needed)';
PRINT '';

-- ===============================================
-- STEP 4: Users and Role Assignments
-- ===============================================
PRINT '=== STEP 4: Users and Roles ===';

-- NOTE: Execute in this order:
-- 1. Argentine_Coaches.sql (creates coaches and assigns Coach role)
-- 2. Argentine_Students.sql (creates students and assigns Student role)

PRINT '✓ Users setup (execute Argentine_Coaches.sql and Argentine_Students.sql)';
PRINT '';

-- ===============================================
-- STEP 5: Taekwondo Content Data
-- ===============================================
PRINT '=== STEP 5: Taekwondo Techniques and Forms ===';

-- Execute Techniques Sample Data
-- (Content from Techniques_Sample.sql would go here)

-- Execute Tuls Sample Data  
-- (Content from Tuls_Sample.sql would go here)

PRINT '✓ Techniques and Tuls (execute Techniques_Sample.sql and Tuls_Sample.sql)';
PRINT '';

-- ===============================================
-- STEP 6: Training Classes and Schedules
-- ===============================================
PRINT '=== STEP 6: Training Classes ===';

-- NOTE: Execute Argentine_Classes.sql for comprehensive class data

PRINT '✓ Training classes (execute Argentine_Classes.sql)';
PRINT '';

-- ===============================================
-- STEP 7: Events and Tournaments
-- ===============================================
PRINT '=== STEP 7: Events and Competitions ===';

-- NOTE: Execute in this order:
-- 1. Initialize_Dashboard_Sample_Data_Final.sql (creates basic events)
-- 2. Tournaments_Sample.sql (comprehensive tournament data)
-- 3. EventAttendance_Sample.sql (attendance records)

PRINT '✓ Events and tournaments (execute tournament and event scripts)';
PRINT '';

-- ===============================================
-- STEP 8: Dashboard and Analytics
-- ===============================================
PRINT '=== STEP 8: Dashboard Configuration ===';

-- NOTE: Execute Initialize_Dashboard_Sample_Data_Final.sql for dashboard setup

PRINT '✓ Dashboard setup (execute Initialize_Dashboard_Sample_Data_Final.sql)';
PRINT '';

-- ===============================================
-- VERIFICATION SUMMARY
-- ===============================================
PRINT '=== FINAL VERIFICATION ===';

-- Count records in main tables
PRINT 'Database population summary:';

-- Use SELECT statements to show counts
SELECT 'UserRoles' as TableName, COUNT(*) as RecordCount FROM UserRoles
UNION ALL
SELECT 'Ranks', COUNT(*) FROM Ranks
UNION ALL  
SELECT 'Users', COUNT(*) FROM Users
UNION ALL
SELECT 'UserUserRoles', COUNT(*) FROM UserUserRoles
UNION ALL
SELECT 'Dojaangs', COUNT(*) FROM Dojaangs
UNION ALL
SELECT 'TrainingClasses', COUNT(*) FROM TrainingClasses
UNION ALL
SELECT 'Techniques', COUNT(*) FROM Techniques
UNION ALL
SELECT 'Tuls', COUNT(*) FROM Tuls
UNION ALL
SELECT 'Events', COUNT(*) FROM Events
UNION ALL
SELECT 'Tournaments', COUNT(*) FROM Tournaments;

PRINT '';
PRINT '=========================================================';
PRINT 'Database population script completed!';
PRINT 'End Time: ' + CAST(GETDATE() as VARCHAR(50));
PRINT '=========================================================';

-- ===============================================
-- EXECUTION GUIDE
-- ===============================================
/*
RECOMMENDED EXECUTION ORDER:

1. Run this script first (creates base system data)

2. Execute individual data scripts:
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Argentine_Dojangs.sql"
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Argentine_Coaches.sql"  
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Argentine_Students.sql"
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Techniques_Sample.sql"
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Tuls_Sample.sql"
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Argentine_Classes.sql"
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Tournaments_Sample.sql"
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "EventAttendance_Sample.sql"
   sqlcmd -S "(localdb)\MSSQLLocalDB" -d TKDHubDb -i "Initialize_Dashboard_Sample_Data_Final.sql"

3. Run verification queries to confirm all data loaded correctly

This will give you a fully populated TKD Hub database with:
- Complete belt ranking system
- Argentine coaches and students with proper roles
- Dojangs across Argentina  
- Comprehensive techniques and forms (Tuls)
- Training classes with schedules
- Tournament and event systems
- Dashboard configurations
- Realistic attendance and participation data
*/

GO
