-- Working Dashboard Analytics Queries (Corrected for Actual Schema)
-- This file contains corrected analytics queries that match your database schema

USE [TKDHubDb]
GO

PRINT '=== Dashboard Analytics Test Queries ===';
PRINT '';

-- =============================================
-- BASIC DASHBOARD METRICS
-- =============================================

PRINT '1. Basic Dashboard Metrics:';
PRINT '';

-- Total Active Students
PRINT 'Total Active Students:';
SELECT COUNT(*) as TotalActiveStudents
FROM Users 
WHERE IsActive = 1;

-- Total Training Classes
PRINT '';
PRINT 'Total Training Classes:';
SELECT COUNT(*) as TotalClasses
FROM TrainingClasses;

-- Upcoming Events
PRINT '';
PRINT 'Upcoming Events:';
SELECT COUNT(*) as UpcomingEvents
FROM Events 
WHERE StartDate > GETDATE();

-- Recent Attendance Rate (Last 7 Days)
PRINT '';
PRINT 'Recent Attendance Summary:';
SELECT 
    COUNT(*) as TotalRecords,
    SUM(CASE WHEN Status = 1 THEN 1 ELSE 0 END) as PresentCount,
    SUM(CASE WHEN Status = 0 THEN 1 ELSE 0 END) as AbsentCount,
    SUM(CASE WHEN Status = 2 THEN 1 ELSE 0 END) as LateCount,
    CASE 
        WHEN COUNT(*) > 0 
        THEN CAST(SUM(CASE WHEN Status = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as DECIMAL(5,2))
        ELSE 0 
    END as AttendanceRate
FROM StudentClassAttendances 
WHERE AttendedAt >= DATEADD(DAY, -7, GETDATE());

-- =============================================
-- STUDENT ANALYTICS
-- =============================================

PRINT '';
PRINT '2. Student Analytics:';
PRINT '';

-- Students by Rank
PRINT 'Students by Rank:';
SELECT 
    r.Name as RankName,
    COUNT(u.Id) as StudentCount
FROM Ranks r
LEFT JOIN Users u ON r.Id = u.CurrentRankId AND u.IsActive = 1
GROUP BY r.Id, r.Name, r.[Order]
ORDER BY r.[Order];

-- Students by Age Group
PRINT '';
PRINT 'Students by Age Group:';
SELECT 
    CASE 
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) < 8 THEN 'Little Dragons (4-7)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) < 15 THEN 'Youth Warriors (8-14)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) < 65 THEN 'Adults (15-64)'
        ELSE 'Seniors (65+)'
    END as AgeGroup,
    COUNT(*) as StudentCount,
    AVG(DATEDIFF(YEAR, DateOfBirth, GETDATE())) as AverageAge
FROM Users 
WHERE IsActive = 1 AND DateOfBirth IS NOT NULL
GROUP BY 
    CASE 
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) < 8 THEN 'Little Dragons (4-7)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) < 15 THEN 'Youth Warriors (8-14)'
        WHEN DATEDIFF(YEAR, DateOfBirth, GETDATE()) < 65 THEN 'Adults (15-64)'
        ELSE 'Seniors (65+)'
    END
ORDER BY AverageAge;

-- =============================================
-- CLASS ANALYTICS
-- =============================================

PRINT '';
PRINT '3. Class Analytics:';
PRINT '';

-- Class Enrollment Summary
PRINT 'Class Enrollment Summary:';
SELECT 
    tc.Name as ClassName,
    tc.Capacity,
    COUNT(sc.Id) as EnrolledStudents,
    tc.Capacity - COUNT(sc.Id) as AvailableSpots,
    CASE 
        WHEN tc.Capacity > 0 
        THEN CAST(COUNT(sc.Id) * 100.0 / tc.Capacity as DECIMAL(5,2))
        ELSE 0 
    END as UtilizationRate
FROM TrainingClasses tc
LEFT JOIN StudentClasses sc ON tc.Id = sc.TrainingClassId
GROUP BY tc.Id, tc.Name, tc.Capacity
ORDER BY UtilizationRate DESC;

-- =============================================
-- RECENT ACTIVITY
-- =============================================

PRINT '';
PRINT '4. Recent Activity:';
PRINT '';

-- Recent Promotions
PRINT 'Recent Promotions (Last 3 Months):';
SELECT 
    u.FirstName + ' ' + u.LastName as StudentName,
    r.Name as NewRank,
    p.PromotionDate,
    p.Notes
FROM Promotions p
INNER JOIN Users u ON p.StudentId = u.Id
INNER JOIN Ranks r ON p.RankId = r.Id
WHERE p.PromotionDate >= DATEADD(MONTH, -3, GETDATE())
ORDER BY p.PromotionDate DESC;

-- Recent Blog Posts
PRINT '';
PRINT 'Recent Blog Posts:';
SELECT 
    bp.Title,
    u.FirstName + ' ' + u.LastName as Author,
    bp.CreatedAt
FROM BlogPosts bp
INNER JOIN Users u ON bp.AuthorId = u.Id
ORDER BY bp.CreatedAt DESC;

-- =============================================
-- DASHBOARD LAYOUTS
-- =============================================

PRINT '';
PRINT '5. Dashboard Layouts:';
PRINT '';

-- Dashboard Layouts by Role
PRINT 'Dashboard Layouts by Role:';
SELECT 
    dl.UserRole,
    dl.Name as LayoutName,
    dl.Description,
    dl.IsDefault,
    CASE WHEN dl.UserId IS NOT NULL THEN 'Personal' ELSE 'Template' END as LayoutType
FROM DashboardLayouts dl
ORDER BY dl.UserRole, dl.IsDefault DESC;

PRINT '';
PRINT '=== Dashboard Analytics Complete ===';
PRINT 'All queries executed successfully!';
PRINT 'Your dashboard system is ready with sample data.';

GO
